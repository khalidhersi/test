using System.Collections.Concurrent;
using System.Net;
using System.Threading.RateLimiting;
using Microsoft.Extensions.Options;

namespace JobAI.API.Middleware;

public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private readonly ConcurrentDictionary<string, RateLimiter> _rateLimiters = new();

    public RateLimitingMiddleware(RequestDelegate next, ILogger<RateLimitingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        
        // Skip rate limiting for certain endpoints
        if (endpoint?.Metadata?.GetMetadata<SkipRateLimitingAttribute>() != null)
        {
            await _next(context);
            return;
        }

        // Get client IP
        var clientIp = GetClientIpAddress(context);
        
        // Get or create rate limiter for this IP
        var rateLimiter = _rateLimiters.GetOrAdd(clientIp, _ => 
            new FixedWindowRateLimiter(new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

        // Try to acquire a permit
        using var lease = rateLimiter.AttemptAcquire(1);
        
        if (lease.IsAcquired)
        {
            await _next(context);
        }
        else
        {
            _logger.LogWarning("Rate limit exceeded for IP: {ClientIp}", clientIp);
            context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
            context.Response.Headers.Add("Retry-After", "60");
            await context.Response.WriteAsync("Too many requests. Please try again later.");
        }
    }

    private string GetClientIpAddress(HttpContext context)
    {
        // Try to get the IP from X-Forwarded-For header
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            return forwardedFor.Split(',')[0].Trim();
        }

        // Fall back to the remote IP address
        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class SkipRateLimitingAttribute : Attribute
{
}


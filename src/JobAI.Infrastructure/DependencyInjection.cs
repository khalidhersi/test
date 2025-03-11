using JobAI.Application.Common.Interfaces;
using JobAI.Infrastructure.Persistence;
using JobAI.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JobAI.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        // Add services
        services.AddTransient<IDateTimeService, DateTimeService>();
        services.AddTransient<ITokenService, TokenService>();
        services.AddTransient<IEmailService, EmailService>();
        services.AddTransient<IFileStorageService, AzureBlobStorageService>();
        services.AddTransient<IResumeParserService, ResumeParserService>();
        services.AddTransient<ITwoFactorAuthService, TwoFactorAuthService>();

        // Add authentication
        services.AddAuthentication(configuration);

        return services;
    }

    private static IServiceCollection AddAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        // Authentication configuration
        // ...

        return services;
    }
}


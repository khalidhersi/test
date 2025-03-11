using JobAI.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace JobAI.Infrastructure.Services;

public class ResumeParserService : IResumeParserService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ResumeParserService> _logger;

    public ResumeParserService(IConfiguration configuration, ILogger<ResumeParserService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<ResumeParseResult> ParseResumeAsync(byte[] fileData, string fileName)
    {
        try
        {
            // In a real implementation, this would call an external resume parsing API
            // For now, we'll return a mock result
            
            _logger.LogInformation("Parsing resume: {FileName}", fileName);
            
            // Simulate API call delay
            await Task.Delay(1000);
            
            return new ResumeParseResult
            {
                FullName = "John Doe",
                Email = "john.doe@example.com",
                PhoneNumber = "555-123-4567",
                Location = "San Francisco, CA",
                Summary = "Experienced software developer with a passion for building scalable applications.",
                Skills = new List<string> { "JavaScript", "React", "Node.js", "C#", ".


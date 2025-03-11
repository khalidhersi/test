using JobAI.Domain.Enums;

namespace JobAI.Application.Common.Interfaces;

public interface IJobScraperService
{
    Task<List<ScrapedJob>> ScrapeJobsAsync(
        string query,
        string? location = null,
        bool? remote = null,
        List<JobType>? jobTypes = null,
        List<ExperienceLevel>? experienceLevels = null,
        int page = 1,
        int pageSize = 20);
    
    Task<ScrapedJob?> ScrapeJobDetailsAsync(string jobId, string source);
}

public class ScrapedJob
{
    public string ExternalId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string? CompanyLogoUrl { get; set; }
    public string Location { get; set; } = string.Empty;
    public bool IsRemote { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Responsibilities { get; set; }
    public string? Requirements { get; set; }
    public string? Benefits { get; set; }
    public string? SalaryRange { get; set; }
    public JobType JobType { get; set; }
    public ExperienceLevel ExperienceLevel { get; set; }
    public string Source { get; set; } = string.Empty;
    public string? ApplicationUrl { get; set; }
    public DateTime PostedDate  } = string.Empty;
    public string? ApplicationUrl { get; set; }
    public DateTime PostedDate { get; set; }
    public List<string> RequiredSkills { get; set; } = new List<string>();
}


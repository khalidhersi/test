using JobAI.Domain.Common;
using JobAI.Domain.Enums;

namespace JobAI.Domain.Entities;

public class Job : BaseAuditableEntity
{
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
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Source { get; set; }
    public string? ExternalJobId { get; set; }
    public string? ApplicationUrl { get; set; }
    
    // Navigation properties
    public Guid? EmployerId { get; set; }
    public virtual User? Employer { get; set; }
    public virtual ICollection<JobSkill> RequiredSkills { get; set; } = new List<JobSkill>();
    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public virtual ICollection<SavedJob> SavedByUsers { get; set; } = new List<SavedJob>();
}


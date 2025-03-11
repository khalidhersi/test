using JobAI.Domain.Common;
using JobAI.Domain.Enums;

namespace JobAI.Domain.Entities;

public class JobApplication : BaseAuditableEntity
{
    public Guid JobId { get; set; }
    public virtual Job Job { get; set; } = null!;
    
    public Guid ApplicantId { get; set; }
    public virtual User Applicant { get; set; } = null!;
    
    public Guid? ResumeId { get; set; }
    public virtual Resume? Resume { get; set; }
    
    public string? CoverLetter { get; set; }
    public string? Achievements { get; set; }
    public string? ScreeningAnswers { get; set; }
    public string? Notes { get; set; }
    
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    public DateTime? SubmittedAt { get; set; }
    public DateTime? LastStatusChangeAt { get; set; }
    
    public virtual ICollection<ApplicationEvent> Events { get; set; } = new List<ApplicationEvent>();
}


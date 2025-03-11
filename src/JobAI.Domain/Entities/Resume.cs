using JobAI.Domain.Common;

namespace JobAI.Domain.Entities;

public class Resume : BaseAuditableEntity
{
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string StoragePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public bool IsDefault { get; set; }
    
    // Parsed resume data
    public string? ParsedContent { get; set; }
    public bool IsParsed { get; set; }
    public DateTime? ParsedAt { get; set; }
    
    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
}


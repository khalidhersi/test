using JobAI.Domain.Common;
using JobAI.Domain.Enums;

namespace JobAI.Domain.Entities;

public class ApplicationEvent : BaseEntity
{
    public Guid ApplicationId { get; set; }
    public virtual JobApplication Application { get; set; } = null!;
    
    public ApplicationEventType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime EventDate { get; set; }
    public string? Time { get; set; }
    public string? Notes { get; set; }
}


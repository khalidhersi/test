using MediatR;

namespace JobAI.Domain.Events;

public class JobCreatedEvent : INotification
{
    public Guid JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public List<Guid> SkillIds { get; set; } = new List<Guid>();
}


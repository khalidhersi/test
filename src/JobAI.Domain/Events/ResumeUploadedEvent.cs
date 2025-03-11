using MediatR;

namespace JobAI.Domain.Events;

public class ResumeUploadedEvent : INotification
{
    public Guid ResumeId { get; set; }
    public Guid UserId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public string StoragePath { get; set; } = string.Empty;
}


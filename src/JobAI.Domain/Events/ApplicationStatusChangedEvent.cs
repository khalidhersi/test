using JobAI.Domain.Entities;
using JobAI.Domain.Enums;
using MediatR;

namespace JobAI.Domain.Events;

public class ApplicationStatusChangedEvent : INotification
{
    public Guid ApplicationId { get; set; }
    public ApplicationStatus OldStatus { get; set; }
    public ApplicationStatus NewStatus { get; set; }
    public string? Notes { get; set; }
    public Guid? ChangedById { get; set; }
}


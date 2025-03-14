using JobAI.Application.Common.Interfaces;

namespace JobAI.Infrastructure.Services;

public class DateTimeService : IDateTime
{
    public DateTime Now => DateTime.UtcNow;
}


using JobAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JobAI.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Job> Jobs { get; }
    DbSet<JobApplication> JobApplications { get; }
    DbSet<ApplicationEvent> ApplicationEvents { get; }
    DbSet<Resume> Resumes { get; }
    DbSet<Skill> Skills { get; }
    DbSet<UserSkill> UserSkills { get; }
    DbSet<JobSkill> JobSkills { get; }
    DbSet<SavedJob> SavedJobs { get; }
    DbSet<Notification> Notifications { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}


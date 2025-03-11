using JobAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobAI.Infrastructure.Persistence.Configurations;

public class JobConfiguration : IEntityTypeConfiguration<Job>
{
    public void Configure(EntityTypeBuilder<Job> builder)
    {
        builder.Property(j => j.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(j => j.Company)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(j => j.CompanyLogoUrl)
            .HasMaxLength(500);

        builder.Property(j => j.Location)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(j => j.Description)
            .IsRequired();

        builder.Property(j => j.Responsibilities);

        builder.Property(j => j.Requirements);

        builder.Property(j => j.Benefits);

        builder.Property(j => j.SalaryRange)
            .HasMaxLength(100);

        builder.Property(j => j.Source)
            .HasMaxLength(100);

        builder.Property(j => j.ExternalJobId)
            .HasMaxLength(100);

        builder.Property(j => j.ApplicationUrl)
            .HasMaxLength(500);

        builder.HasOne(j => j.Employer)
            .WithMany(u => u.CreatedJobs)
            .HasForeignKey(j => j.EmployerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}


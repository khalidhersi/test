using JobAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JobAI.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.Property(u => u.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.HasIndex(u => u.Email)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .IsRequired();

        builder.Property(u => u.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(u => u.PhoneNumber)
            .HasMaxLength(20);

        builder.Property(u => u.Location)
            .HasMaxLength(200);

        builder.Property(u => u.Bio)
            .HasMaxLength(2000);

        builder.Property(u => u.Title)
            .HasMaxLength(200);

        builder.Property(u => u.LinkedInUrl)
            .HasMaxLength(500);

        builder.Property(u => u.GithubUrl)
            .HasMaxLength(500);

        builder.Property(u => u.PortfolioUrl)
            .HasMaxLength(500);

        builder.Property(u => u.CurrentSalary)
            .HasMaxLength(50);

        builder.Property(u => u.ExpectedSalaryMin)
            .HasMaxLength(50);

        builder.Property(u => u.ExpectedSalaryMax)
            .HasMaxLength(50);

        builder.Property(u => u.RefreshToken)
            .HasMaxLength(500);
    }
}


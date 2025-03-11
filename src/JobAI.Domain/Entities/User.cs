using System;
using System.Collections.Generic;
using JobAI.Domain.Common;
using JobAI.Domain.Enums;

namespace JobAI.Domain.Entities
{
    public class User : BaseAuditableEntity
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public UserRole Role { get; set; } = UserRole.JobSeeker;
        public string RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        
        // Two-factor authentication properties
        public bool TwoFactorEnabled { get; set; } = false;
        public string TwoFactorSecretKey { get; set; }
        public DateTime? TwoFactorSetupDate { get; set; }
        public string RecoveryCodesJson { get; set; } // Stored as JSON array
        public string EmailVerificationCodeHash { get; set; }
        public DateTime? EmailVerificationCodeExpiry { get; set; }
        
        // Navigation properties
        public virtual ICollection<Resume> Resumes { get; set; }
        public virtual ICollection<JobApplication> Applications { get; set; }
        public virtual ICollection<SavedJob> SavedJobs { get; set; }
        public virtual ICollection<UserSkill> Skills { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
    }
}


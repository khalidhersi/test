using System;
using System.Security.Cryptography;
using System.Text;
using JobAI.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using OtpNet;

namespace JobAI.Infrastructure.Services
{
    public class TwoFactorAuthService : ITwoFactorAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IDateTimeService _dateTimeService;

        public TwoFactorAuthService(
            IConfiguration configuration,
            IEmailService emailService,
            IDateTimeService dateTimeService)
        {
            _configuration = configuration;
            _emailService = emailService;
            _dateTimeService = dateTimeService;
        }

        public string GenerateSecretKey()
        {
            // Generate a random secret key for TOTP
            var secretKey = KeyGeneration.GenerateRandomKey(20);
            return Base32Encoding.ToString(secretKey);
        }

        public string GenerateTotpCode(string secretKey)
        {
            var key = Base32Encoding.ToBytes(secretKey);
            var totp = new Totp(key);
            return totp.ComputeTotp(_dateTimeService.Now);
        }

        public bool ValidateTotpCode(string secretKey, string totpCode)
        {
            var key = Base32Encoding.ToBytes(secretKey);
            var totp = new Totp(key);
            return totp.VerifyTotp(_dateTimeService.Now, totpCode, out _);
        }

        public async Task<string> SendEmailVerificationCode(string email)
        {
            // Generate a 6-digit code
            var random = new Random();
            var code = random.Next(100000, 999999).ToString();
            
            // Hash the code for storage
            var codeHash = HashVerificationCode(code);
            
            // Send email with the code
            var subject = "Your verification code";
            var body = $"Your verification code is: {code}. It will expire in 10 minutes.";
            await _emailService.SendEmailAsync(email, subject, body);
            
            return codeHash;
        }
        
        public bool VerifyEmailCode(string storedHash, string providedCode)
        {
            // Hash the provided code and compare with stored hash
            var providedHash = HashVerificationCode(providedCode);
            return storedHash == providedHash;
        }
        
        private string HashVerificationCode(string code)
        {
            using var sha256 = SHA256.Create();
            var secretBytes = Encoding.UTF8.GetBytes(code + _configuration["Security:CodeSalt"]);
            var hashBytes = sha256.ComputeHash(secretBytes);
            return Convert.ToBase64String(hashBytes);
        }
        
        public string GenerateQrCodeUri(string secretKey, string email, string issuer = "JobAI")
        {
            return $"otpauth://totp/{Uri.EscapeDataString(issuer)}:{Uri.EscapeDataString(email)}?secret={secretKey}&issuer={Uri.EscapeDataString(issuer)}";
        }
    }
}


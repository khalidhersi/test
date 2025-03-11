namespace JobAI.Application.Common.Interfaces;

public interface ITwoFactorAuthService
{
    string GenerateSecretKey();
    string GenerateTotpCode(string secretKey);
    bool ValidateTotpCode(string secretKey, string totpCode);
    Task<string> SendEmailVerificationCode(string email);
    bool VerifyEmailCode(string storedHash, string providedCode);
    string GenerateQrCodeUri(string secretKey, string email, string issuer = "JobAI");
}


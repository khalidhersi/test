using JobAI.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace JobAI.Application.Auth.Commands.VerifyTwoFactor;

public class VerifyTwoFactorCommand : IRequest<AuthResponseDto>
{
    public string TemporaryToken { get; set; }
    public string VerificationCode { get; set; }
    public bool IsRecoveryCode { get; set; } = false;
}

public class VerifyTwoFactorCommandHandler : IRequestHandler<VerifyTwoFactorCommand, AuthResponseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly ITwoFactorAuthService _twoFactorAuthService;
    private readonly IDateTimeService _dateTimeService;

    public VerifyTwoFactorCommandHandler(
        IApplicationDbContext context,
        ITokenService tokenService,
        ITwoFactorAuthService twoFactorAuthService,
        IDateTimeService dateTimeService)
    {
        _context = context;
        _tokenService = tokenService;
        _twoFactorAuthService = twoFactorAuthService;
        _dateTimeService = dateTimeService;
    }

    public async Task<AuthResponseDto> Handle(VerifyTwoFactorCommand request, CancellationToken cancellationToken)
    {
        // Validate the temporary token to get the user ID
        var (userId, _) = _tokenService.ValidateRefreshToken(request.TemporaryToken);
        
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("Invalid temporary token");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        bool isValid;
        
        if (request.IsRecoveryCode)
        {
            // Validate recovery code
            isValid = ValidateRecoveryCode(user, request.VerificationCode);
        }
        else
        {
            // Validate TOTP code
            isValid = _twoFactorAuthService.ValidateTotpCode(user.TwoFactorSecretKey, request.VerificationCode);
        }

        if (!isValid)
        {
            throw new UnauthorizedAccessException("Invalid verification code");
        }

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        
        // Update refresh token in database
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = _dateTimeService.Now.AddDays(7);
        
        await _context.SaveChangesAsync(cancellationToken);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = _dateTimeService.Now.AddHours(1),
            UserId = user.Id.ToString(),
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString()
        };
    }
    
    private bool ValidateRecoveryCode(Domain.Entities.User user, string recoveryCode)
    {
        if (string.IsNullOrEmpty(user.RecoveryCodesJson))
        {
            return false;
        }
        
        var recoveryCodes = JsonSerializer.Deserialize<List<string>>(user.RecoveryCodesJson);
        
        if (recoveryCodes == null || !recoveryCodes.Contains(recoveryCode))
        {
            return false;
        }
        
        // Remove the used recovery code
        recoveryCodes.Remove(recoveryCode);
        user.RecoveryCodesJson = JsonSerializer.Serialize(recoveryCodes);
        
        return true;
    }
}


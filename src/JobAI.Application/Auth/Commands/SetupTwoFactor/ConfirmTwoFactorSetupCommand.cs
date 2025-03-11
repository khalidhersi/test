using JobAI.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json;

namespace JobAI.Application.Auth.Commands.SetupTwoFactor;

public class ConfirmTwoFactorSetupCommand : IRequest<bool>
{
    public string VerificationCode { get; set; }
}

public class ConfirmTwoFactorSetupCommandHandler : IRequestHandler<ConfirmTwoFactorSetupCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ITwoFactorAuthService _twoFactorAuthService;
    private readonly IDateTimeService _dateTimeService;

    public ConfirmTwoFactorSetupCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        ITwoFactorAuthService twoFactorAuthService,
        IDateTimeService dateTimeService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _twoFactorAuthService = twoFactorAuthService;
        _dateTimeService = dateTimeService;
    }

    public async Task<bool> Handle(ConfirmTwoFactorSetupCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        if (string.IsNullOrEmpty(user.TwoFactorSecretKey))
        {
            throw new InvalidOperationException("Two-factor authentication has not been set up");
        }

        // Validate the verification code
        var isValid = _twoFactorAuthService.ValidateTotpCode(user.TwoFactorSecretKey, request.VerificationCode);

        if (!isValid)
        {
            return false;
        }

        // Enable two-factor authentication
        user.TwoFactorEnabled = true;
        user.TwoFactorSetupDate = _dateTimeService.Now;
        
        // Generate recovery codes
        var recoveryCodes = GenerateRecoveryCodes(10);
        user.RecoveryCodesJson = JsonSerializer.Serialize(recoveryCodes);

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
    
    private List<string> GenerateRecoveryCodes(int count)
    {
        var recoveryCodes = new List<string>();
        var random = new Random();
        
        for (int i = 0; i < count; i++)
        {
            // Generate a random 10-character alphanumeric code
            var code = new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());
            
            // Format as XXXXX-XXXXX
            code = $"{code.Substring(0, 5)}-{code.Substring(5, 5)}";
            recoveryCodes.Add(code);
        }
        
        return recoveryCodes;
    }
}


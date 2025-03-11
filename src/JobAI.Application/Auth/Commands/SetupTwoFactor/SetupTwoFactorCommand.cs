using JobAI.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JobAI.Application.Auth.Commands.SetupTwoFactor;

public class SetupTwoFactorCommand : IRequest<TwoFactorSetupResponseDto>
{
}

public class TwoFactorSetupResponseDto
{
    public string SecretKey { get; set; }
    public string QrCodeUri { get; set; }
}

public class SetupTwoFactorCommandHandler : IRequestHandler<SetupTwoFactorCommand, TwoFactorSetupResponseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;
    private readonly ITwoFactorAuthService _twoFactorAuthService;

    public SetupTwoFactorCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService,
        ITwoFactorAuthService twoFactorAuthService)
    {
        _context = context;
        _currentUserService = currentUserService;
        _twoFactorAuthService = twoFactorAuthService;
    }

    public async Task<TwoFactorSetupResponseDto> Handle(SetupTwoFactorCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id.ToString() == userId, cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("User not found");
        }

        // Generate a new secret key
        var secretKey = _twoFactorAuthService.GenerateSecretKey();
        
        // Store the secret key temporarily (not enabled yet until confirmed)
        user.TwoFactorSecretKey = secretKey;
        await _context.SaveChangesAsync(cancellationToken);

        // Generate QR code URI
        var qrCodeUri = _twoFactorAuthService.GenerateQrCodeUri(secretKey, user.Email);

        return new TwoFactorSetupResponseDto
        {
            SecretKey = secretKey,
            QrCodeUri = qrCodeUri
        };
    }
}


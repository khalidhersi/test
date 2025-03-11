using JobAI.Domain.Entities;

namespace JobAI.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    (string userId, DateTime expiry) ValidateRefreshToken(string refreshToken);
}


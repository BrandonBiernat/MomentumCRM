using MomentumCRM.Persistence.Entities.User;

namespace MomentumCRM.Services.Auth;

public readonly record struct AccessToken(string Value, DateTime ExpiresAtUtc);

public interface ITokenService {
    AccessToken CreateAccessToken(User user);
    string CreateRefreshToken();
    string HashRefreshToken(string refreshToken);
}

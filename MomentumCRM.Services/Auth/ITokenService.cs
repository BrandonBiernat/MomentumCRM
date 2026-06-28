using MomentumCRM.Persistence.Entities;

namespace MomentumCRM.Services.Auth;

public readonly record struct AccessToken(string Value, DateTime ExpiresAtUtc);

public interface ITokenService {
    AccessToken CreateAccessToken(User user);
}

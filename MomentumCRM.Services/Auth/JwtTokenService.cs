using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MomentumCRM.Persistence.Entities.User;

namespace MomentumCRM.Services.Auth;

public class JwtTokenService(IOptions<JwtOptions> options) : ITokenService {
    private readonly JwtOptions _options = options.Value;

    public AccessToken CreateAccessToken(User user) {
        DateTime expiresAtUtc = DateTime.UtcNow.AddMinutes(_options.AccessTokenMinutes);

        Claim[] claims = [
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.CreateVersion7().ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        ];

        SymmetricSecurityKey signingKey = new(Encoding.UTF8.GetBytes(_options.Key));
        SigningCredentials credentials = new(signingKey, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAtUtc,
            signingCredentials: credentials);

        string value = new JwtSecurityTokenHandler().WriteToken(token);
        return new AccessToken(value, expiresAtUtc);
    }

    public string CreateRefreshToken() {
        byte[] randomBytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(randomBytes);
    }

    public string HashRefreshToken(string refreshToken) {
        byte[] hash = SHA256.HashData(Encoding.UTF8.GetBytes(refreshToken));
        return Convert.ToHexString(hash);
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Entities.User;
using MomentumCRM.Services.Auth.Dtos;
using MomentumCRM.Services.Common.Exceptions;
using MomentumCRM.Services.Settings;
using MomentumCRM.Services.Settings.Dtos;

namespace MomentumCRM.Services.Auth;

public class AuthService(
    UserManager<User> userManager,
    ITokenService tokenService,
    ISettingsService settingsService,
    AuthDbContext db,
    IOptions<JwtOptions> jwtOptions) : IAuthService {

    private readonly JwtOptions _jwt = jwtOptions.Value;

    public async Task<AuthResult> RegisterAsync(
        RegisterRequest request,
        CancellationToken ct = default) {
        User? existing = await userManager.FindByEmailAsync(request.Email);
        if (existing is not null)
            throw new EmailAlreadyInUseException(request.Email);

        User user = new(email: request.Email, displayName: request.DisplayName);

        IdentityResult result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new IdentityException(result.Errors.Select(e => e.Description));

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResult> LoginAsync(
        LoginRequest request,
        CancellationToken ct = default) {
        User user = await userManager.FindByEmailAsync(request.Email)
            ?? throw new InvalidCredentialsException();

        bool passwordValid = await userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordValid)
            throw new InvalidCredentialsException();

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResult> RefreshAsync(
        string refreshToken,
        CancellationToken ct = default) {
        string hash = tokenService.HashRefreshToken(refreshToken);
        RefreshToken? stored = await db.RefreshTokens
            .FirstOrDefaultAsync(t => t.TokenHash == hash, ct) 
                ?? throw new InvalidRefreshTokenException();

        if (stored.RevokedAtUtc is not null) {
            await RevokeAllActiveAsync(stored.UserId, ct);
            throw new InvalidRefreshTokenException();
        }

        if (DateTime.UtcNow >= stored.ExpiresAtUtc)
            throw new InvalidRefreshTokenException();

        User user = await userManager.FindByIdAsync(stored.UserId.ToString())
            ?? throw new InvalidRefreshTokenException();

        return await IssueTokensAsync(user, ct, rotatedFrom: stored);
    }

    public async Task LogoutAsync(
        string refreshToken,
        CancellationToken ct = default) {
        string hash = tokenService.HashRefreshToken(refreshToken);
        RefreshToken? stored = await db.RefreshTokens
            .FirstOrDefaultAsync(t => t.TokenHash == hash, ct);

        if (stored is not null && stored.RevokedAtUtc is null) {
            stored.Revoke();
            await db.SaveChangesAsync(ct);
        }
    }

    private async Task<AuthResult> IssueTokensAsync(
        User user,
        CancellationToken ct,
        RefreshToken? rotatedFrom = null) {
        AccessToken access = tokenService.CreateAccessToken(user);

        string rawRefresh = tokenService.CreateRefreshToken();
        DateTime refreshExpiry = DateTime.UtcNow.AddDays(_jwt.RefreshTokenDays);
        RefreshToken newToken = new(
            userId: user.Id,
            tokenHash: tokenService.HashRefreshToken(rawRefresh),
            expiresAtUtc: refreshExpiry);
        db.RefreshTokens.Add(newToken);

        rotatedFrom?.Revoke(newToken.Id);

        await db.SaveChangesAsync(ct);

        UserSettingsResponse settings = await
            settingsService.GetOrCreateAsync(user.Id, ct);

        return new AuthResult(
            UserId: user.Id,
            Email: user.Email!,
            DisplayName: user.DisplayName,
            Role: user.Role.ToString(),
            AccessToken: access.Value,
            AccessTokenExpiresAtUtc: access.ExpiresAtUtc,
            RefreshToken: rawRefresh,
            RefreshTokenExpiresAtUtc: refreshExpiry,
            Settings: settings);
    }

    private async Task RevokeAllActiveAsync(Guid userId, CancellationToken ct) {
        List<RefreshToken> active = await db.RefreshTokens
            .Where(t => t.UserId == userId && t.RevokedAtUtc == null)
            .ToListAsync(ct);

        foreach (RefreshToken token in active)
            token.Revoke();

        await db.SaveChangesAsync(ct);
    }
}

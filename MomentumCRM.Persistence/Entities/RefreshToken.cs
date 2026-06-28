using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MomentumCRM.Persistence.Entities;

public readonly record struct RefreshTokenId(Guid Value) {
    public static RefreshTokenId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();

    public sealed class EFConverter() : ValueConverter<RefreshTokenId, Guid>(
        id => id.Value,
        value => new RefreshTokenId(value)) {
    }
}

public class RefreshToken {
    public RefreshTokenId Id { get; private set; }
    public Guid UserId { get; private set; }
    public string TokenHash { get; private set; }
    public DateTime ExpiresAtUtc { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? RevokedAtUtc { get; private set; }
    public RefreshTokenId? ReplacedByTokenId { get; private set; }

    public bool IsActive => RevokedAtUtc is null && DateTime.UtcNow < ExpiresAtUtc;

    private RefreshToken() { TokenHash = null!; }

    public RefreshToken(Guid userId, string tokenHash, DateTime expiresAtUtc) {
        Id = RefreshTokenId.New();
        UserId = userId;
        TokenHash = tokenHash;
        ExpiresAtUtc = expiresAtUtc;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void Revoke(RefreshTokenId? replacedByTokenId = null) {
        if (RevokedAtUtc is not null)
            return;
        RevokedAtUtc = DateTime.UtcNow;
        ReplacedByTokenId = replacedByTokenId;
    }
}

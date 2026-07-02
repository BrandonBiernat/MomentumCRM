using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Entities.User;
using MomentumCRM.Persistence.Enums.Users;

namespace MomentumCRM.Persistence.Contexts;

public class AuthDbContext(
    DbContextOptions<AuthDbContext> options,
    ICurrentUser currentUser) : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options) {
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<UserSettings> UserSettings => Set<UserSettings>();

    private static readonly JsonSerializerOptions SettingsJsonOptions = new() {
        Converters = { new JsonStringEnumConverter() }
    };

    public override int SaveChanges() {
        StampAudit();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default) {
        StampAudit();
        return base.SaveChangesAsync(ct);
    }

    private void StampAudit() {
        Guid? userId = currentUser.Id;
        DateTime nowUtc = DateTime.UtcNow;

        foreach (EntityEntry<IAuditable> entry in ChangeTracker.Entries<IAuditable>()) {
            if (entry.State == EntityState.Added) {
                entry.Property(nameof(IAuditable.CreatedBy)).CurrentValue = userId;
            } else if (entry.State == EntityState.Modified) {
                entry.Property(nameof(IAuditable.UpdatedAtUtc)).CurrentValue = nowUtc;
                entry.Property(nameof(IAuditable.UpdatedBy)).CurrentValue = userId;
            }
        }
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder) {
        configurationBuilder.Properties<UserRole>().HaveConversion<string>().HaveMaxLength(20);
        configurationBuilder.Properties<RefreshTokenId>().HaveConversion<RefreshTokenId.EFConverter>();
    }

    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder);

        builder.Entity<RefreshToken>(token => {
            token.Property(t => t.TokenHash).HasMaxLength(64);
            token.HasIndex(t => t.TokenHash).IsUnique();
            token.HasIndex(t => t.UserId);
            token.HasOne<User>()
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<UserSettings>(settings => {
            settings.HasKey(s => s.UserId);

            settings.Property(s => s.Settings)
                .HasColumnType("jsonb")
                .HasConversion(
                    data => JsonSerializer.Serialize(data, SettingsJsonOptions),
                    json => JsonSerializer.Deserialize<UserSettingsData>(json, SettingsJsonOptions)!,
                    new ValueComparer<UserSettingsData>(
                        (a, b) => JsonSerializer.Serialize(a, SettingsJsonOptions)
                            == JsonSerializer.Serialize(b, SettingsJsonOptions),
                        v => JsonSerializer.Serialize(v, SettingsJsonOptions).GetHashCode(),
                        v => JsonSerializer.Deserialize<UserSettingsData>(
                            JsonSerializer.Serialize(v, SettingsJsonOptions), SettingsJsonOptions)!));

            settings.HasOne<User>()
                .WithOne()
                .HasForeignKey<UserSettings>(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

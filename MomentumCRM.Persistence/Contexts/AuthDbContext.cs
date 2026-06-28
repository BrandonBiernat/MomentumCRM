using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Enums.Users;

namespace MomentumCRM.Persistence.Contexts;

public class AuthDbContext(
    DbContextOptions<AuthDbContext> options,
    ICurrentUser currentUser) : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options) {
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

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
    }
}

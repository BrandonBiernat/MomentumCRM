using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Persistence.Contexts;

public class MomentumCrmDbContext : DbContext {
    private readonly ICurrentUser? _currentUser;

    public MomentumCrmDbContext(
        DbContextOptions<MomentumCrmDbContext> options,
        ICurrentUser currentUser) : base(options) {
        _currentUser = currentUser;
    }

    protected MomentumCrmDbContext() { }

    public DbSet<Customer> Customers => Set<Customer>();

    public override int SaveChanges() {
        StampAudit();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default) {
        StampAudit();
        return base.SaveChangesAsync(ct);
    }

    private void StampAudit() {
        Guid? userId = _currentUser?.Id;
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
        // Customer
        configurationBuilder.Properties<CustomerId>().HaveConversion<CustomerId.EFConverter>();
        configurationBuilder.Properties<CustomerType>().HaveConversion<string>().HaveMaxLength(20);
        configurationBuilder.Properties<CustomerSource>().HaveConversion<string>().HaveMaxLength(20);
        configurationBuilder.Properties<CustomerStatus>().HaveConversion<string>().HaveMaxLength(20);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        // Entities
        modelBuilder.Entity<Customer>().OwnsOne(c => c.Address);
        modelBuilder.Entity<Customer>().OwnsOne(c => c.Phone);

        modelBuilder.Entity<Customer>().HasQueryFilter(c => c.ArchivedAtUtc == null);

        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Email).IsUnique()
            .HasFilter("\"ArchivedAtUtc\" IS NULL");
        modelBuilder.Entity<Customer>()
            .HasIndex(c => c.Domain).IsUnique()
            .HasFilter("\"ArchivedAtUtc\" IS NULL");
    }
}
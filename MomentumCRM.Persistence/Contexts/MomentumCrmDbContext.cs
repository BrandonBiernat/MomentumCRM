using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Persistence.Contexts;

public class MomentumCrmDbContext : DbContext {
    public MomentumCrmDbContext(DbContextOptions options) : base(options) { }
    protected MomentumCrmDbContext() { }

    public DbSet<Customer> Customers => Set<Customer>();

    public override int SaveChanges() {
        StampAuditTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default) {
        StampAuditTimestamps();
        return base.SaveChangesAsync(ct);
    }

    private void StampAuditTimestamps() {
        foreach (EntityEntry<IAuditable> entry in ChangeTracker.Entries<IAuditable>())
            if (entry.State == EntityState.Modified)
                entry.Property(nameof(IAuditable.UpdatedAtUtc)).CurrentValue = DateTime.UtcNow;
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
        modelBuilder.Entity<Customer>().HasIndex(c => c.Email).IsUnique();
        modelBuilder.Entity<Customer>().HasIndex(c => c.Domain).IsUnique();
    }
}
using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Persistence.Contexts;

public class MomentumCrmDbContext : DbContext {
    public MomentumCrmDbContext(DbContextOptions options) : base(options) { }
    protected MomentumCrmDbContext() { }

    public DbSet<Customer> Customers => Set<Customer>();

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

        // Enums
        modelBuilder.HasPostgresEnum<CustomerStatus>();
        modelBuilder.HasPostgresEnum<CustomerType>();
        modelBuilder.HasPostgresEnum<CustomerSource>();
    }
}
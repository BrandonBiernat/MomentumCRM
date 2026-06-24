using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Entities;

namespace MomentumCRM.Persistence.Contexts;

public class MomentumCrmDbContext : DbContext {
    public MomentumCrmDbContext(DbContextOptions options) : base(options) { }
    protected MomentumCrmDbContext() { }

    public DbSet<Customer> Customers => Set<Customer>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder) {
        configurationBuilder.Properties<CustomerId>().HaveConversion<CustomerId.EFConverter>();
    }
}
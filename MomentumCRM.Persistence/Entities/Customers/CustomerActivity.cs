using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Persistence.Entities.Customers;

public readonly record struct CustomerActivityId(Guid Value) {
    public static CustomerActivityId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();

    public sealed class EFConverter() : ValueConverter<CustomerActivityId, Guid>(
        id => id.Value,
        value => new CustomerActivityId(value)) {
    }
}

public class CustomerActivity : IEntity<CustomerActivityId> {
    public CustomerActivityId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public CustomerActivityType Type { get; private set; }
    public string? Data { get; private set; }
    public Guid? ActorId { get; private set; }
    public DateTime OccurredAtUtc { get; private set; }

    private CustomerActivity() { }

    public CustomerActivity(
        CustomerId customerId,
        CustomerActivityType type,
        string? data,
        Guid? actorId) {
        Id = CustomerActivityId.New();
        CustomerId = customerId;
        Type = type;
        Data = data;
        ActorId = actorId;
        OccurredAtUtc = DateTime.UtcNow;
    }
}

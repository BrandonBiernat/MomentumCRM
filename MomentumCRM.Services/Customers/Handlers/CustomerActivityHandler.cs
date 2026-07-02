using System.Text.Json;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Entities.Customers;
using MomentumCRM.Persistence.Enums.Customers;
using MomentumCRM.Services.Events;

namespace MomentumCRM.Services.Customers.Handlers;

public class CustomerActivityHandler(MomentumCrmDbContext db) :
    IEventHandler<CustomerCreated>,
    IEventHandler<CustomerStatusChanged>,
    IEventHandler<NoteAdded>,
    IEventHandler<NoteRemoved> {

    public Task HandleAsync(CustomerCreated domainEvent, CancellationToken ct = default) {
        Record(
            domainEvent.CustomerId,
            CustomerActivityType.Created,
            new { status = domainEvent.Status.ToString() },
            domainEvent.ActorId);
        return Task.CompletedTask;
    }

    public Task HandleAsync(CustomerStatusChanged domainEvent, CancellationToken ct = default) {
        Record(
            domainEvent.CustomerId,
            CustomerActivityType.StatusChanged,
            new {
                from = domainEvent.FromStatus.ToString(),
                to = domainEvent.ToStatus.ToString(),
                reason = domainEvent.Reason,
            },
            domainEvent.ActorId);
        return Task.CompletedTask;
    }

    public Task HandleAsync(NoteAdded domainEvent, CancellationToken ct = default) {
        Record(
            domainEvent.CustomerId,
            CustomerActivityType.NoteAdded,
            new { preview = domainEvent.Preview },
            domainEvent.ActorId);
        return Task.CompletedTask;
    }

    public Task HandleAsync(NoteRemoved domainEvent, CancellationToken ct = default) {
        Record(
            domainEvent.CustomerId,
            CustomerActivityType.NoteRemoved,
            new { preview = domainEvent.Preview },
            domainEvent.ActorId);
        return Task.CompletedTask;
    }

    private void Record(Guid customerId, CustomerActivityType type, object payload, Guid? actorId) =>
        db.CustomerActivities.Add(new CustomerActivity(
            new CustomerId(customerId),
            type,
            JsonSerializer.Serialize(payload),
            actorId));
}

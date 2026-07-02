using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Services.Events;

public record CustomerCreated(
    Guid CustomerId,
    CustomerStatus Status,
    Guid? ActorId) : IEvent;

public record CustomerStatusChanged(
    Guid CustomerId,
    CustomerStatus FromStatus,
    CustomerStatus ToStatus,
    string? Reason,
    Guid? ActorId) : IEvent;

public record NoteAdded(
    Guid CustomerId,
    string Preview,
    Guid? ActorId) : IEvent;

public record NoteRemoved(
    Guid CustomerId,
    string Preview,
    Guid? ActorId) : IEvent;

using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Persistence.Entities;

public readonly record struct CustomerStatusChangeId(Guid Value) {
    public static CustomerStatusChangeId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();

    public sealed class EFConverter() : ValueConverter<CustomerStatusChangeId, Guid>(
        id => id.Value,
        value => new CustomerStatusChangeId(value)) {
    }
}

// One row per status transition — the audit trail behind the status workflow,
// and the seed of the customer's activity timeline. FromStatus is null for the
// initial entry created when the customer is first added.
public class CustomerStatusChange : IEntity<CustomerStatusChangeId> {
    public CustomerStatusChangeId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public CustomerStatus? FromStatus { get; private set; }
    public CustomerStatus ToStatus { get; private set; }
    public string? Reason { get; private set; }
    public Guid? ChangedBy { get; private set; }
    public DateTime ChangedAtUtc { get; private set; }

    private CustomerStatusChange() { }

    public CustomerStatusChange(
        CustomerId customerId,
        CustomerStatus? fromStatus,
        CustomerStatus toStatus,
        string? reason,
        Guid? changedBy) {
        Id = CustomerStatusChangeId.New();
        CustomerId = customerId;
        FromStatus = fromStatus;
        ToStatus = toStatus;
        Reason = string.IsNullOrWhiteSpace(reason) ? null : reason.Trim();
        ChangedBy = changedBy;
        ChangedAtUtc = DateTime.UtcNow;
    }
}

using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MomentumCRM.Persistence.Abstractions;

namespace MomentumCRM.Persistence.Entities.Customers;

public readonly record struct CustomerNoteId(Guid Value) {
    public static CustomerNoteId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();

    public sealed class EFConverter() : ValueConverter<CustomerNoteId, Guid>(
        id => id.Value,
        value => new CustomerNoteId(value)) {
    }
}

public class CustomerNote : IEntity<CustomerNoteId>, IAuditable {
    public CustomerNoteId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public string Body { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    private CustomerNote() { Body = null!; }

    public CustomerNote(CustomerId customerId, string body) {
        Id = CustomerNoteId.New();
        CustomerId = customerId;
        Body = body.Trim();
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void UpdateBody(string body) {
        Body = body.Trim();
    }
}

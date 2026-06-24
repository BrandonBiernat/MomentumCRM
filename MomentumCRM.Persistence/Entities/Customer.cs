using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MomentumCRM.Persistence.Abstractions;

namespace MomentumCRM.Persistence.Entities;

public readonly record struct CustomerId(Guid Value) {
    public static CustomerId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();

    public sealed class EFConverter() : ValueConverter<CustomerId, Guid>(
        id => id.Value,
        value => new CustomerId(value));
} 

public class Customer : IEntity<CustomerId>, IAuditable {
    public CustomerId Id { get; private set; }
    public string Name { get; private set; }
    public string? Email { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    private Customer() { }
    public Customer(
        string name,
        string? email = null
    ) {
        Id = CustomerId.New();
        Name = name.Trim();
        Email = email;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeEmail(string? email) {
        Email = email;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void Rename(string name) {
        Name = name;
        UpdatedAtUtc = DateTime.UtcNow;
    }
}
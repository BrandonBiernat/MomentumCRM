using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Persistence.Entities;

public readonly record struct CustomerId(Guid Value) {
    public static CustomerId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();

    public sealed class EFConverter() : ValueConverter<CustomerId, Guid>(
        id => id.Value,
        value => new CustomerId(value)) {
    }
}

public class Customer : IEntity<CustomerId>, IAuditable {
    public CustomerId Id { get; private set; }
    public string Name { get; private set; }
    public string? Email { get; private set; }
    public string? Domain { get; private set; }
    public Phone? Phone { get; private set; }
    public Address? Address { get; private set; }
    public CustomerType Type { get; private set; }
    public CustomerSource Source { get; private set; }
    public CustomerStatus Status { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public Guid? ArchivedBy { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }
    public DateTime? ArchivedAtUtc { get; private set; }

    public bool IsArchived => ArchivedAtUtc is not null;

    private Customer() { Name = null!; }
    public Customer(
        string name,
        CustomerType type,
        CustomerSource source,
        string? email = null,
        Phone? phone = null
    ) {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required", nameof(name));

        if (string.IsNullOrWhiteSpace(email) && phone is null)
            throw new ArgumentException("Email or Phone is required");

        Id = CustomerId.New();
        Name = name.Trim();
        Email = email?.Trim().ToLower();
        Phone = phone;
        Type = type;
        Status = CustomerStatus.Lead;
        Source = source;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeEmail(string? email) {
        Email = email?.Trim().ToLower();
    }

    public void ChangePhone(Phone? phone) {
        Phone = phone;
    }

    public void Rename(string name) {
        Name = name.Trim();
    }

    public void ChangeDomain(string? domain) {
        Domain = domain?.Trim().ToLower();
    }

    public void ChangeAddress(Address? address) {
        Address = address;
    }

    public void ChangeType(CustomerType type) {
        Type = type;
    }

    public void Activate() {
        Status = CustomerStatus.Active;
    }

    public void MarkInactive() {
        Status = CustomerStatus.Inactive;
    }

    public void Archive(Guid? archivedBy) {
        if (ArchivedAtUtc is not null)
            return;
        ArchivedAtUtc = DateTime.UtcNow;
        ArchivedBy = archivedBy;
    }

    public void Restore() {
        ArchivedAtUtc = null;
        ArchivedBy = null;
    }
}
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
    public string? Phone { get; private set; }
    public string? Domain { get; private set; }
    public Address? Address { get; private set; }
    public CustomerType Type { get; private set; }
    public CustomerSource? Source { get; private set; }
    public CustomerStatus Status { get; private set; }

    // TODO: Add user of the creator here
    // TODO: Add user who updated it here

    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    private Customer() { }
    public Customer(
        string name,
        CustomerType type,
        string? email = null,
        string? phone = null,
        CustomerSource? source = null
    ) {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name is required", nameof(name));

        Id = CustomerId.New();
        Name = name.Trim();
        Email = email;
        Phone = phone;
        Type = type;
        Status = CustomerStatus.Lead;
        Source = source;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeEmail(string? email) {
        Email = email;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void ChangePhone(string? phone) {
        Phone = phone;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void Rename(string name) {
        Name = name;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeDomain(string? domain) {
        Domain = domain;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeAddress(Address? address) {
        Address = address;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeType(CustomerType type) {
        Type = type;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeSource(CustomerSource? source) {
        Source = source;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void Activate() {
        Status = CustomerStatus.Active;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void MarkInactive() {
        Status = CustomerStatus.Inactive;
        UpdatedAtUtc = DateTime.UtcNow;
    }
}
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Entities.CustomFields;
using MomentumCRM.Persistence.Entities.Customers;

namespace MomentumCRM.Persistence.Entities.Contacts;

public readonly record struct ContactId(Guid Value) {
    public static ContactId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();

    public sealed class EFConverter() : ValueConverter<ContactId, Guid>(
        id => id.Value,
        value => new ContactId(value)) {
    }
}

public class Contact : IEntity<ContactId>, IAuditable, IHasCustomFields {
    public ContactId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string? PreferredName { get; private set; }
    public string? JobTitle { get; private set; }
    public string? Email { get; private set; }
    public Phone? Phone { get; private set; }
    public bool IsPrimary { get; private set; }
    public CustomFieldValues CustomFields { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public Guid? ArchivedBy { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }
    public DateTime? ArchivedAtUtc { get; private set; }

    public bool IsArchived => ArchivedAtUtc is not null;

    public Contact() {
        FirstName = null!;
        LastName = null!;
        CustomFields = new CustomFieldValues();
    }

    public Contact(
        CustomerId customerId,
        string firstName,
        string lastName,
        string? email = null,
        Phone? phone = null,
        string? preferredName = null,
        string? jobTitle = null) {
        if (string.IsNullOrWhiteSpace(firstName))
            throw new ArgumentException("First name is required", nameof(firstName));
        if (string.IsNullOrWhiteSpace(lastName))
            throw new ArgumentException("Last name is required", nameof(lastName));
        if (string.IsNullOrWhiteSpace(email) && phone is null)
            throw new ArgumentException("Email or Phone is required");

        Id = ContactId.New();
        CustomerId = customerId;
        FirstName = firstName.Trim();
        LastName = lastName.Trim();
        PreferredName = preferredName?.Trim();
        JobTitle = jobTitle?.Trim();
        Email = email?.Trim().ToLower();
        Phone = phone;
        CustomFields = new CustomFieldValues();
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeName(string firstName, string lastName) {
        FirstName = firstName.Trim();
        LastName = lastName.Trim();
    }
    
    public void ChangeEmail(string? email) => Email = email?.Trim().ToLower();
    public void ChangePhone(Phone? phone) => Phone = phone;
    public void ChangeJobTitle(string? jobTitle) => JobTitle = jobTitle?.Trim();
    public void ChangePreferredName(string? preferredName) => PreferredName = preferredName?.Trim();
    public void MarkPrimary() => IsPrimary = true;
    public void UnmarkPrimary() => IsPrimary = false;

    public void Archive(Guid? archivedBy) {
        if (ArchivedAtUtc is not null) return;
        ArchivedAtUtc = DateTime.UtcNow;
        ArchivedBy = archivedBy;
    }

    public void Restore() {
        ArchivedAtUtc = null;
        ArchivedBy = null;
    }
}

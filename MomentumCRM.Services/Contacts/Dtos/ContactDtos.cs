using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using MomentumCRM.Persistence.Entities.Contacts;
using MomentumCRM.Services.Customers.Dtos;

namespace MomentumCRM.Services.Contacts.Dtos;

public record CreateContactRequest(
    [Required] Guid CustomerId,
    [Required, MaxLength(100)] string FirstName,
    [Required, MaxLength(100)] string LastName,
    [EmailAddress] string? Email,
    CreatePhoneRequest? Phone,
    [MaxLength(100)] string? PreferredName,
    [MaxLength(150)] string? JobTitle,
    bool IsPrimary,
    IReadOnlyDictionary<string, JsonElement>? CustomFields);

public record UpdateContactRequest(
    [Required, MaxLength(100)] string FirstName,
    [Required, MaxLength(100)] string LastName,
    [EmailAddress] string? Email,
    CreatePhoneRequest? Phone,
    [MaxLength(100)] string? PreferredName,
    [MaxLength(150)] string? JobTitle,
    bool IsPrimary,
    IReadOnlyDictionary<string, JsonElement>? CustomFields);

public record ContactResponse(
    Guid Id,
    Guid CustomerId,
    string FirstName,
    string LastName,
    string? PreferredName,
    string? JobTitle,
    string? Email,
    PhoneResponse? Phone,
    bool IsPrimary,
    IReadOnlyDictionary<string, JsonElement> CustomFields,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    DateTime? ArchivedAtUtc
) {
    public static ContactResponse FromEntity(Contact c) =>
        new(
            c.Id.Value,
            c.CustomerId.Value,
            c.FirstName,
            c.LastName,
            c.PreferredName,
            c.JobTitle,
            c.Email,
            c.Phone is not null
                ? PhoneResponse.FromValueObject(c.Phone)
                : null,
            c.IsPrimary,
            c.CustomFields.Values,
            c.CreatedAtUtc,
            c.UpdatedAtUtc,
            c.ArchivedAtUtc);
}

using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Services.Customers.Dtos;

public record AddressResponse(
    string Street,
    string City,
    string State,
    string PostalCode,
    string Country
) {
    public static AddressResponse FromValueObject(Address address) =>
        new(address.Street, address.City, address.State, address.PostalCode, address.Country);
}

public record PhoneResponse(
    string Number,
    string? Extension
) {
    public static PhoneResponse FromValueObject(Phone phone) =>
        new(phone.Number, phone.Extension);
}

public record CustomerResponse(
    Guid Id,
    string Name,
    string? Email,
    PhoneResponse? Phone,
    string? Domain,
    AddressResponse? Address,
    CustomerType Type,
    CustomerSource Source,
    CustomerStatus Status,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    DateTime? ArchivedAtUtc
) {
    public static CustomerResponse FromEntity(Customer c) =>
        new(
            c.Id.Value,
            c.Name,
            c.Email,
            c.Phone is not null
                ? PhoneResponse.FromValueObject(c.Phone)
                : null,
            c.Domain,
            c.Address is not null
                ? AddressResponse.FromValueObject(c.Address)
                : null,
            c.Type,
            c.Source,
            c.Status,
            c.CreatedAtUtc,
            c.UpdatedAtUtc,
            c.ArchivedAtUtc);
}
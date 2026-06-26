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

public record CustomerResponse(
    Guid Id,
    string Name,
    string? Email,
    string? Phone,
    string? Domain,
    AddressResponse? Address,
    CustomerType Type,
    CustomerSource? Source,
    CustomerStatus Status,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc
) {
    public static CustomerResponse FromEntity(Customer c) =>
        new(
            c.Id.Value,
            c.Name,
            c.Email,
            c.Phone,
            c.Domain,
            c.Address is not null
                ? AddressResponse.FromValueObject(c.Address)
                : null,
            c.Type,
            c.Source,
            c.Status,
            c.CreatedAtUtc,
            c.UpdatedAtUtc);
}
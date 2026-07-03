using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Entities.Customers;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Services.Customers.Dtos;

public record UpdateAddressRequest(
    [Required] string Street,
    [Required] string City,
    [Required] string State,
    [Required] string PostalCode,
    [Required] string Country
) {
    public Address ToValueObject() =>
        new(Street, City, State, PostalCode, Country);
};

public record UpdatePhoneRequest(
    [Required, Phone] string Number,
    string? Extension
) {
    public Phone ToValueObject() =>
        Phone.Create(Number, Extension);
}

public record UpdateCustomerRequest(
    [Required] string Name,
    [Required] CustomerType Type,
    [EmailAddress] string? Email,
    UpdatePhoneRequest? Phone,
    string? Domain,
    UpdateAddressRequest? Address,
    CustomerSource? Source,
    IReadOnlyDictionary<string, JsonElement>? CustomFields
);
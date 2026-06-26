using System.ComponentModel.DataAnnotations;
using MomentumCRM.Persistence.Entities;
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

public record UpdateCustomerRequest(
    [Required] string Name,
    [EmailAddress] string? Email,
    [Phone] string? Phone,
    string? Domain,
    UpdateAddressRequest? Address,
    CustomerSource? Source
);
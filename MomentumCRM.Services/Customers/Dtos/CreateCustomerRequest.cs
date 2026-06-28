using System.ComponentModel.DataAnnotations;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Services.Customers.Dtos;

public record CreatePhoneRequest(
    [Phone] string Number,
    string? Extension
) {
    public Phone ToValueObject() =>
        Phone.Create(Number, Extension);
}

public record CreateCustomerRequest(
    [Required, MaxLength(200)] string Name,
    [Required] CustomerType Type,
    [Required] CustomerSource Source,
    [EmailAddress] string? Email,
    CreatePhoneRequest? Phone);
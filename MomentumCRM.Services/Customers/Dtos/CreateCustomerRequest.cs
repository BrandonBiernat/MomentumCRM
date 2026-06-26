using System.ComponentModel.DataAnnotations;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Services.Customers.Dtos;

public record CreateCustomerRequest (
    [Required, MaxLength(200)] string Name,
    [Required] CustomerType Type,
    [EmailAddress] string? Email,
    [Phone] string? Phone,
    CustomerSource? Source);
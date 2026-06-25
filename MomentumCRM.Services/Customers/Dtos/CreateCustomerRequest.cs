using System.ComponentModel.DataAnnotations;

namespace MomentumCRM.Services.Customers.Dtos;

public record CreateCustomerRequest (
    [property: Required, MaxLength(200)] string Name,
    [property: EmailAddress] string? Email);
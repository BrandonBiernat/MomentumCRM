using System.ComponentModel.DataAnnotations;

namespace MomentumCRM.Services.Customers.Dtos;

public record CreateCustomerRequest (
    [Required, MaxLength(200)] string Name,
    [EmailAddress] string? Email);
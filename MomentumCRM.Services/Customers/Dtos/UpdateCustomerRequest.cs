using System.ComponentModel.DataAnnotations;

namespace MomentumCRM.Services;

public record UpdateCustomerRequest(
    [Required] string Name,
    [EmailAddress] string? Email    
);
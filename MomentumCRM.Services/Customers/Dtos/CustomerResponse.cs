namespace MomentumCRM.Services.Customers.Dtos;

public record CustomerResponse (
    Guid Id,
    string Name,
    string? Email,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc
);
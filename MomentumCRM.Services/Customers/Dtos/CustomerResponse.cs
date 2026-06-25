using MomentumCRM.Persistence.Entities;

namespace MomentumCRM.Services.Customers.Dtos;

public record CustomerResponse (
    Guid Id,
    string Name,
    string? Email,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc
) {
    public static CustomerResponse FromEntity(Customer c) =>
        new(c.Id.Value, c.Name, c.Email, c.CreatedAtUtc, c.UpdatedAtUtc);
}
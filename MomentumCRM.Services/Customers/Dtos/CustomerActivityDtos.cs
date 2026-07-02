using System.Text.Json;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Entities.Customers;
using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Services.Customers.Dtos;

public record ChangeStatusRequest(
    CustomerStatus Status,
    string? Reason);

public record CustomerActivityResponse(
    Guid Id,
    CustomerActivityType Type,
    JsonElement? Data,
    Guid? ActorId,
    DateTime OccurredAtUtc
) {
    public static CustomerActivityResponse FromEntity(CustomerActivity activity) =>
        new(
            activity.Id.Value,
            activity.Type,
            activity.Data is null ? null : JsonSerializer.Deserialize<JsonElement>(activity.Data),
            activity.ActorId,
            activity.OccurredAtUtc);
}

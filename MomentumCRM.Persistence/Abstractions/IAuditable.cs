namespace MomentumCRM.Persistence.Abstractions;

public interface IAuditable {
    // TODO: Add user of the creator here
    // TODO: Add user who updated it here
    DateTime CreatedAtUtc { get; }
    DateTime? UpdatedAtUtc { get; }
}
namespace MomentumCRM.Persistence.Abstractions;

public interface IAuditable {
    DateTime CreatedAtUtc { get; }
    DateTime? UpdatedAtUtc { get; }
}

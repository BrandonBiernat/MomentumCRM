namespace MomentumCRM.Persistence.Abstractions;

public interface IAuditable {
    Guid? CreatedBy { get; }
    Guid? UpdatedBy { get; }
    DateTime CreatedAtUtc { get; }
    DateTime? UpdatedAtUtc { get; }
}

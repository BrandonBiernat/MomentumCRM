namespace MomentumCRM.Persistence.Abstractions;

public interface IEntity<out TId> {
    TId Id { get; }
}

namespace MomentumCRM.Persistence.Abstractions;

public interface ICurrentUser {
    Guid? Id { get; }
}

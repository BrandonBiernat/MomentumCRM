namespace MomentumCRM.Services.Events;

public interface IEvent { }

public interface IEventHandler<in TEvent> where TEvent : IEvent {
    Task HandleAsync(TEvent domainEvent, CancellationToken ct = default);
}

public interface IEventPublisher {
    Task PublishAsync<TEvent>(TEvent domainEvent, CancellationToken ct = default)
        where TEvent : IEvent;
}

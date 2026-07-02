namespace MomentumCRM.Services.Events;

public class EventPublisher(IServiceProvider serviceProvider) : IEventPublisher {
    public async Task PublishAsync<TEvent>(TEvent domainEvent, CancellationToken ct = default)
        where TEvent : IEvent {
        object? resolved = serviceProvider.GetService(typeof(IEnumerable<IEventHandler<TEvent>>));
        if (resolved is not IEnumerable<IEventHandler<TEvent>> handlers)
            return;

        foreach (IEventHandler<TEvent> handler in handlers)
            await handler.HandleAsync(domainEvent, ct);
    }
}

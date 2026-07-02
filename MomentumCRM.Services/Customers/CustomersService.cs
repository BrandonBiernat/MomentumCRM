using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Entities.Customers;
using MomentumCRM.Persistence.Enums.Customers;
using MomentumCRM.Services.Common.Exceptions;
using MomentumCRM.Services.Customers.Dtos;
using MomentumCRM.Services.Events;

namespace MomentumCRM.Services.Customers;

public class CustomersService(
    MomentumCrmDbContext db,
    ICurrentUser currentUser,
    IEventPublisher events) : ICustomersService {
    public async Task<CustomerResponse> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken ct = default) {
        if (string.IsNullOrWhiteSpace(request.Email) && request.Phone is null)
            throw new CustomerHasNoContactInfoException();

        if (!string.IsNullOrWhiteSpace(request.Email)) {
            bool emailInUse = await
                db.Customers.AnyAsync(c => c.Email == request.Email, ct);
            if (emailInUse)
                throw new CustomerAlreadyExistsException(request.Email);
        }
        
        Customer newCustomer = new(
            name: request.Name,
            type: request.Type,
            email: request.Email,
            phone: request.Phone?.ToValueObject(),
            source: request.Source);

        db.Customers.Add(newCustomer);
        await events.PublishAsync(
            new CustomerCreated(newCustomer.Id.Value, newCustomer.Status, currentUser.Id), ct);
            
        await db.SaveChangesAsync(ct);

        return CustomerResponse.FromEntity(newCustomer);
    }

    public async Task<CustomerResponse> UpdateAsync(
        Guid id,
        UpdateCustomerRequest request,
        CancellationToken ct = default) {
        Customer customer = await db.Customers
            .FindAsync([new CustomerId(id)], ct)
                ?? throw new CustomerNotFoundException(id);

        if (customer.IsArchived)
            throw new CustomerArchivedException(id);

        if (string.IsNullOrWhiteSpace(request.Email) && request.Phone is null)
            throw new CustomerHasNoContactInfoException();

        if (!string.IsNullOrWhiteSpace(request.Email)) {
            bool emailExists = await db.Customers
                .AnyAsync(c =>
                    c.Email == request.Email &&
                    c.Id != customer.Id, ct);
            if (emailExists)
                throw new CustomerAlreadyExistsException(request.Email);
        }

        customer.Rename(request.Name);
        customer.ChangeEmail(request.Email);
        customer.ChangePhone(request.Phone?.ToValueObject());
        customer.ChangeDomain(request.Domain);
        customer.ChangeAddress(request.Address?.ToValueObject());
        customer.ChangeType(request.Type);

        await db.SaveChangesAsync(ct);
        return CustomerResponse.FromEntity(customer);
    }

    public async Task<CustomerResponse> PatchAsync(
        Guid id,
        PatchCustomerRequest request,
        CancellationToken ct = default) {
        Customer customer = await db.Customers
            .FindAsync([new CustomerId(id)], ct)
                ?? throw new CustomerNotFoundException(id);

        if (customer.IsArchived)
            throw new CustomerArchivedException(id);

        if (!string.IsNullOrWhiteSpace(request.Name))
            customer.Rename(request.Name);
        if (request.Type is not null)
            customer.ChangeType(request.Type.Value);
        if (request.Source is not null)
            customer.ChangeSource(request.Source.Value);

        if (request.Email.HasValue) {
            string? email = request.Email.Value?.Trim().ToLower();
            if (!string.IsNullOrWhiteSpace(email)) {
                bool emailExists = await db.Customers
                    .AnyAsync(c => c.Email == email && c.Id != customer.Id, ct);
                if (emailExists)
                    throw new CustomerAlreadyExistsException(email);
            }
            customer.ChangeEmail(email);
        }

        if (request.Domain.HasValue)
            customer.ChangeDomain(request.Domain.Value);
        if (request.Phone.HasValue)
            customer.ChangePhone(request.Phone.Value?.ToValueObject());
        if (request.Address.HasValue)
            customer.ChangeAddress(request.Address.Value?.ToValueObject());

        if (string.IsNullOrWhiteSpace(customer.Email) && customer.Phone is null)
            throw new CustomerHasNoContactInfoException();

        await db.SaveChangesAsync(ct);
        return CustomerResponse.FromEntity(customer);
    }

    public async Task<CustomerResponse> ChangeStatusAsync(
        Guid id,
        ChangeStatusRequest request,
        CancellationToken ct = default) {
        Customer customer = await db.Customers
            .FindAsync([new CustomerId(id)], ct)
                ?? throw new CustomerNotFoundException(id);

        if (customer.IsArchived)
            throw new CustomerArchivedException(id);

        if (customer.Status == request.Status)
            return CustomerResponse.FromEntity(customer);

        if (!customer.CanTransitionTo(request.Status))
            throw new InvalidStatusTransitionException(customer.Status, request.Status);
        if (request.Status == CustomerStatus.Inactive && string.IsNullOrWhiteSpace(request.Reason))
            throw new StatusChangeReasonRequiredException();

        CustomerStatus from = customer.Status;
        customer.ChangeStatus(request.Status);

        await events.PublishAsync(
            new CustomerStatusChanged(customer.Id.Value, from, request.Status, request.Reason, currentUser.Id),
            ct);

        await db.SaveChangesAsync(ct);
        return CustomerResponse.FromEntity(customer);
    }

    public async Task<IReadOnlyList<CustomerActivityResponse>> GetActivityAsync(
        Guid id,
        CancellationToken ct = default) {
        CustomerId customerId = new(id);
        List<CustomerActivity> activities = await db.CustomerActivities
            .AsNoTracking()
            .Where(a => a.CustomerId == customerId)
            .OrderByDescending(a => a.OccurredAtUtc)
            .ToListAsync(ct);
        return [.. activities.Select(CustomerActivityResponse.FromEntity)];
    }

    public async Task ArchiveAsync(
        Guid id,
        CancellationToken ct = default) {
        Customer customer = await db.Customers
            .FirstOrDefaultAsync(c => c.Id == new CustomerId(id), ct)
                ?? throw new CustomerNotFoundException(id);

        customer.Archive(currentUser.Id);
        await db.SaveChangesAsync(ct);
    }

    public async Task RestoreAsync(
        Guid id,
        CancellationToken ct = default) {
        Customer customer = await db.Customers
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(c => c.Id == new CustomerId(id) && c.ArchivedAtUtc != null, ct)
                ?? throw new CustomerNotFoundException(id);

        // The unique Email/Domain indexes are filtered to active rows, so an
        // active customer may have taken this one's email/domain while it was
        // archived. Restoring would violate the index, so guard with a clear error.
        if (!string.IsNullOrWhiteSpace(customer.Email)) {
            bool emailInUse = await db.Customers
                .AnyAsync(c => c.Email == customer.Email, ct);
            if (emailInUse)
                throw new CustomerRestoreConflictException(customer.Email);
        }

        if (!string.IsNullOrWhiteSpace(customer.Domain)) {
            bool domainInUse = await db.Customers
                .AnyAsync(c => c.Domain == customer.Domain, ct);
            if (domainInUse)
                throw new CustomerRestoreConflictException(customer.Domain);
        }

        customer.Restore();
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(
        Guid id,
        CancellationToken ct = default) {
        Customer customer = await db.Customers
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(c => c.Id == new CustomerId(id) && c.ArchivedAtUtc != null, ct)
                ?? throw new CustomerNotFoundException(id);

        db.Customers.Remove(customer);
        await db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<CustomerResponse>> GetAllAsync(
        CustomerStatus? status,
        bool archived,
        CancellationToken ct = default) {
        IQueryable<Customer> query = archived
            ? db.Customers.IgnoreQueryFilters().Where(c => c.ArchivedAtUtc != null)
            : db.Customers;

        if (status is not null)
            query = query.Where(c => c.Status == status);

        IOrderedQueryable<Customer> ordered = archived
            ? query.OrderByDescending(c => c.ArchivedAtUtc)
            : query.OrderByDescending(c => c.CreatedAtUtc);

        List<Customer> customers = await
            ordered.AsNoTracking().ToListAsync(ct);
        return [.. customers.Select(CustomerResponse.FromEntity)];
    }

    public async Task<CustomerResponse> GetByIdAsync(
        Guid id,
        CancellationToken ct = default) {
        Customer customer = await db.Customers
            .IgnoreQueryFilters()
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == new CustomerId(id), ct)
                ?? throw new CustomerNotFoundException(id);
        return CustomerResponse.FromEntity(customer);
    }

    public async Task<IReadOnlyList<CustomerResponse>> GetByIdsAsync(
        IReadOnlyList<Guid> ids,
        CancellationToken ct = default) {
        if (ids.Count == 0)
            return [];

        HashSet<CustomerId> customerIds = [.. ids.Select(id => new CustomerId(id))];

        List<Customer> customers = await db.Customers
            .AsNoTracking()
            .Where(c => customerIds.Contains(c.Id))
            .OrderByDescending(c => c.CreatedAtUtc)
            .ToListAsync(ct);
        return [.. customers.Select(CustomerResponse.FromEntity)];
    }

    public async Task<CustomerSummaryResponse> GetSummaryAsync(
        bool archived,
        CancellationToken ct = default) {
        IQueryable<Customer> query = archived
            ? db.Customers.IgnoreQueryFilters().Where(c => c.ArchivedAtUtc != null)
            : db.Customers;

        var counts = await query
            .GroupBy(c => c.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        int CountOf(CustomerStatus s) => counts.FirstOrDefault(x => x.Status == s)?.Count ?? 0;

        return new CustomerSummaryResponse(
            All: counts.Sum(x => x.Count),
            Lead: CountOf(CustomerStatus.Lead),
            Prospect: CountOf(CustomerStatus.Prospect),
            Active: CountOf(CustomerStatus.Active),
            Inactive: CountOf(CustomerStatus.Inactive));
    }
}
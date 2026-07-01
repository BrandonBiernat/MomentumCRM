using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Persistence.Enums.Customers;
using MomentumCRM.Services.Common.Exceptions;
using MomentumCRM.Services.Customers.Dtos;

namespace MomentumCRM.Services.Customers;

public class CustomersService(
    MomentumCrmDbContext db,
    ICurrentUser currentUser) : ICustomersService {
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

        customer.Restore();
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
        IReadOnlyList<CustomerResponse> customers = await GetByIdsAsync([id], ct);
        if (customers.Count == 0)
            throw new CustomerNotFoundException(id);
        return customers[0];
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
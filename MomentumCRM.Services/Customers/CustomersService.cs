using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Services.Common.Exceptions;
using MomentumCRM.Services.Customers.Dtos;

namespace MomentumCRM.Services.Customers;

public class CustomersService(MomentumCrmDbContext db) : ICustomersService {
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

    public async Task<IReadOnlyList<CustomerResponse>> GetAllAsync(CancellationToken ct = default) {
        List<Customer> customers = await db.Customers
            .AsNoTracking()
            .OrderByDescending(c => c.CreatedAtUtc)
            .ToListAsync(ct);
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
}
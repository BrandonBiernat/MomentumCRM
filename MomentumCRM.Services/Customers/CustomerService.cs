using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Services.Common.Exceptions;
using MomentumCRM.Services.Customers.Dtos;

namespace MomentumCRM.Services.Customers;

public class CustomerService(MomentumCrmDbContext db) : ICustomersService {
    public async Task<CustomerResponse> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken ct = default) {
        bool emailInUse = await
            db.Customers.AnyAsync(c => c.Email == request.Email, ct);

        if (emailInUse && request.Email is not null)
            throw new CustomerAlreadyExistsException(request.Email);

        Customer newCustomer = new(
            name: request.Name,
            email: request.Email);

        db.Customers.Add(newCustomer);
        await db.SaveChangesAsync(ct);

        return new CustomerResponse(
            Id: newCustomer.Id.Value,
            Name: newCustomer.Name,
            Email: newCustomer.Email,
            CreatedAtUtc: newCustomer.CreatedAtUtc,
            UpdatedAtUtc: newCustomer.UpdatedAtUtc);
    }
}
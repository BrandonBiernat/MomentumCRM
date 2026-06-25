using MomentumCRM.Services.Customers.Dtos;

namespace MomentumCRM.Services.Customers;

public interface ICustomersService {
    Task<CustomerResponse> CreateAsync(CreateCustomerRequest request, CancellationToken ct = default);
}
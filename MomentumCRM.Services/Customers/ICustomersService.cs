using MomentumCRM.Services.Customers.Dtos;

namespace MomentumCRM.Services.Customers;

public interface ICustomersService {
    Task<CustomerResponse> CreateAsync(
        CreateCustomerRequest request,
        CancellationToken ct = default);
    Task<CustomerResponse> UpdateAsync(
        Guid id,
        UpdateCustomerRequest request,
        CancellationToken ct = default);
    Task<IReadOnlyList<CustomerResponse>> GetAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<CustomerResponse>> GetByIdsAsync(
        IReadOnlyList<Guid> ids,
        CancellationToken ct = default);
    Task<CustomerResponse> GetByIdAsync(
        Guid id,
        CancellationToken ct = default);
}
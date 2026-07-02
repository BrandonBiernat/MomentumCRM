using MomentumCRM.Persistence.Enums.Customers;
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
    Task<CustomerResponse> PatchAsync(
        Guid id,
        PatchCustomerRequest request,
        CancellationToken ct = default);
    Task<CustomerResponse> ChangeStatusAsync(
        Guid id,
        ChangeStatusRequest request,
        CancellationToken ct = default);
    Task<IReadOnlyList<CustomerActivityResponse>> GetActivityAsync(
        Guid id,
        CancellationToken ct = default);
    Task<IReadOnlyList<CustomerResponse>> GetAllAsync(
        CustomerStatus? status,
        bool archived,
        CancellationToken ct = default);
    Task<CustomerSummaryResponse> GetSummaryAsync(bool archived, CancellationToken ct = default);
    Task<IReadOnlyList<CustomerResponse>> GetByIdsAsync(
        IReadOnlyList<Guid> ids,
        CancellationToken ct = default);
    Task<CustomerResponse> GetByIdAsync(
        Guid id,
        CancellationToken ct = default);
    Task ArchiveAsync(Guid id, CancellationToken ct = default);
    Task RestoreAsync(Guid id, CancellationToken ct = default);
}
using MomentumCRM.Services.Contacts.Dtos;

namespace MomentumCRM.Services.Contacts;

public interface IContactsService {
    Task<ContactResponse> CreateAsync(
        CreateContactRequest request,
        CancellationToken ct = default);
    Task<ContactResponse> UpdateAsync(
        Guid id,
        UpdateContactRequest request,
        CancellationToken ct = default);
    Task<ContactResponse> GetByIdAsync(
        Guid id,
        CancellationToken ct = default);
    Task<IReadOnlyList<ContactResponse>> GetByCustomerAsync(
        Guid customerId,
        bool archived,
        CancellationToken ct = default);
    Task<ContactResponse> MakePrimaryAsync(Guid id, CancellationToken ct = default);
    Task ArchiveAsync(Guid id, CancellationToken ct = default);
    Task RestoreAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}

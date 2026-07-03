using MomentumCRM.Persistence.Enums.CustomFields;
using MomentumCRM.Services.CustomFields.Dtos;

namespace MomentumCRM.Services.CustomFields;

public interface ICustomFieldDefinitionService {
    Task<CustomFieldDefinitionResponse> CreateAsync(
        CreateCustomFieldDefinitionRequest request,
        CancellationToken ct = default);
    Task<CustomFieldDefinitionResponse> UpdateAsync(
        Guid id,
        UpdateCustomFieldDefinitionRequest request,
        CancellationToken ct = default);
    Task<CustomFieldDefinitionResponse> GetByIdAsync(
        Guid id,
        CancellationToken ct = default);
    Task<IReadOnlyList<CustomFieldDefinitionResponse>> GetAllAsync(
        CustomFieldTarget? target,
        bool archived,
        CancellationToken ct = default);
    Task ArchiveAsync(Guid id, CancellationToken ct = default);
    Task RestoreAsync(Guid id, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}

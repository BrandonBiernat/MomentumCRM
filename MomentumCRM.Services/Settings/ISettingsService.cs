using MomentumCRM.Services.Settings.Dtos;

namespace MomentumCRM.Services.Settings;

public interface ISettingsService {
    Task<UserSettingsResponse> GetOrCreateAsync(Guid userId, CancellationToken ct = default);
    Task<UserSettingsResponse> UpdateAsync(
        Guid userId,
        UpdateSettingsRequest request,
        CancellationToken ct = default);
}

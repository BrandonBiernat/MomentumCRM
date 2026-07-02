using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities.User;
using MomentumCRM.Services.Settings.Dtos;

namespace MomentumCRM.Services.Settings;

public class SettingsService(AuthDbContext db) : ISettingsService {
    public async Task<UserSettingsResponse> GetOrCreateAsync(
        Guid userId,
        CancellationToken ct = default) {
        UserSettings settings = await GetOrCreateEntityAsync(userId, ct);
        return UserSettingsResponse.FromData(settings.Settings);
    }

    public async Task<UserSettingsResponse> UpdateAsync(
        Guid userId,
        UpdateSettingsRequest request,
        CancellationToken ct = default) {
        UserSettings settings = await GetOrCreateEntityAsync(userId, ct);
        settings.Replace(request.ToData());
        await db.SaveChangesAsync(ct);
        return UserSettingsResponse.FromData(settings.Settings);
    }

    private async Task<UserSettings> GetOrCreateEntityAsync(
        Guid userId,
        CancellationToken ct) {
        UserSettings? settings = await db.UserSettings.FindAsync([userId], ct);
        if (settings is null) {
            settings = new UserSettings(userId);
            db.UserSettings.Add(settings);
            await db.SaveChangesAsync(ct);
        }

        return settings;
    }
}

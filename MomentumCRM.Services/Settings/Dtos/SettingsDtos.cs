using MomentumCRM.Persistence.Entities.User;
using MomentumCRM.Persistence.Enums.Users;

namespace MomentumCRM.Services.Settings.Dtos;

public record UserSettingsResponse(
    ThemePreference Theme,
    bool EventEmailSubscription
) {
    public static UserSettingsResponse FromData(UserSettingsData data) =>
        new(data.Theme, data.EventEmailSubscription);
}

public record UpdateSettingsRequest(
    ThemePreference Theme,
    bool EventEmailSubscription
) {
    public UserSettingsData ToData() => new() {
        Theme = Theme,
        EventEmailSubscription = EventEmailSubscription
    };
}

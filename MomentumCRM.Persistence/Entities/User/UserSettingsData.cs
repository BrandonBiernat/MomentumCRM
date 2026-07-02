using MomentumCRM.Persistence.Enums.Users;

namespace MomentumCRM.Persistence.Entities.User;

public class UserSettingsData {
    public ThemePreference Theme { get; set; }
    public bool EventEmailSubscription { get; set; }

    public static UserSettingsData Default() => new() {
        Theme = ThemePreference.System,
        EventEmailSubscription = true
    };
}

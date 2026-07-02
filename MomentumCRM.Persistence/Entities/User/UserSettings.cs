namespace MomentumCRM.Persistence.Entities.User;

public class UserSettings {
    public Guid UserId { get; private set; }
    public UserSettingsData Settings { get; private set; }

    private UserSettings() { Settings = null!; }

    public UserSettings(Guid userId) {
        UserId = userId;
        Settings = UserSettingsData.Default();
    }

    public void Replace(UserSettingsData settings) {
        Settings = settings;
    }
}

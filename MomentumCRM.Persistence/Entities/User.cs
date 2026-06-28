using Microsoft.AspNetCore.Identity;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Enums.Users;

namespace MomentumCRM.Persistence.Entities;

public class User : IdentityUser<Guid>, IAuditable {
    public string DisplayName { get; private set; }
    public UserRole Role { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    private User() { DisplayName = null!; }

    public User(
        string email,
        string displayName,
        UserRole role = UserRole.Member) {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email is required", nameof(email));
        if (string.IsNullOrWhiteSpace(displayName))
            throw new ArgumentException("Display name is required", nameof(displayName));

        Id = Guid.CreateVersion7();
        Email = email.Trim().ToLower();
        UserName = Email;
        DisplayName = displayName.Trim();
        Role = role;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public void ChangeDisplayName(string displayName) {
        DisplayName = displayName.Trim();
    }

    public void ChangeRole(UserRole role) {
        Role = role;
    }
}

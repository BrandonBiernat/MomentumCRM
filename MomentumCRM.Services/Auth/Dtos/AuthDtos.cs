using System.ComponentModel.DataAnnotations;
using MomentumCRM.Persistence.Entities;

namespace MomentumCRM.Services.Auth.Dtos;

public record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password,
    [Required, MaxLength(100)] string DisplayName);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

public record AuthResponse(
    Guid UserId,
    string Email,
    string DisplayName,
    string Role,
    string Token,
    DateTime ExpiresAtUtc) {
    public static AuthResponse FromToken(User user, AccessToken token) =>
        new(
            UserId: user.Id,
            Email: user.Email!,
            DisplayName: user.DisplayName,
            Role: user.Role.ToString(),
            Token: token.Value,
            ExpiresAtUtc: token.ExpiresAtUtc);
}

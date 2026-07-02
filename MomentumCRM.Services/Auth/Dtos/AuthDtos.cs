using System.ComponentModel.DataAnnotations;
using MomentumCRM.Services.Settings.Dtos;

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
    DateTime ExpiresAtUtc,
    UserSettingsResponse Settings);

public record AuthResult(
    Guid UserId,
    string Email,
    string DisplayName,
    string Role,
    string AccessToken,
    DateTime AccessTokenExpiresAtUtc,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc,
    UserSettingsResponse Settings);

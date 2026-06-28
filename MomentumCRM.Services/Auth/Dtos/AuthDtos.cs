using System.ComponentModel.DataAnnotations;

namespace MomentumCRM.Services.Auth.Dtos;

public record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(8)] string Password,
    [Required, MaxLength(100)] string DisplayName);

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required] string Password);

// Returned to the client in the response BODY.
// The refresh token is NOT here — it travels in an httpOnly cookie the JS never sees.
public record AuthResponse(
    Guid UserId,
    string Email,
    string DisplayName,
    string Role,
    string Token,
    DateTime ExpiresAtUtc);

// Service -> controller. Carries the raw refresh token so the controller (which owns
// HTTP/cookie concerns) can set the cookie, then strip it before returning the body.
public record AuthResult(
    Guid UserId,
    string Email,
    string DisplayName,
    string Role,
    string AccessToken,
    DateTime AccessTokenExpiresAtUtc,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc);

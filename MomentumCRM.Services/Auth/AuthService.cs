using Microsoft.AspNetCore.Identity;
using MomentumCRM.Persistence.Entities;
using MomentumCRM.Services.Auth.Dtos;
using MomentumCRM.Services.Common.Exceptions;

namespace MomentumCRM.Services.Auth;

public class AuthService(
    UserManager<User> userManager,
    ITokenService tokenService) : IAuthService {

    public async Task<AuthResponse> RegisterAsync(
        RegisterRequest request,
        CancellationToken ct = default) {
        User? existing = await userManager
            .FindByEmailAsync(request.Email);
        if (existing is not null)
            throw new EmailAlreadyInUseException(request.Email);

        User user = new(
            email: request.Email,
            displayName: request.DisplayName);

        IdentityResult result = await userManager
            .CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new IdentityException(result.Errors.Select(e => e.Description));

        AccessToken token = tokenService.CreateAccessToken(user);
        return AuthResponse.FromToken(user, token);
    }

    public async Task<AuthResponse> LoginAsync(
        LoginRequest request,
        CancellationToken ct = default) {
        User user = await userManager
            .FindByEmailAsync(request.Email)
                ?? throw new InvalidCredentialsException();

        bool passwordValid = await userManager
            .CheckPasswordAsync(user, request.Password);
        if (!passwordValid)
            throw new InvalidCredentialsException();

        AccessToken token = tokenService.CreateAccessToken(user);
        return AuthResponse.FromToken(user, token);
    }
}

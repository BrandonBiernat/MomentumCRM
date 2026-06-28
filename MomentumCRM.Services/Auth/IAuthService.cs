using MomentumCRM.Services.Auth.Dtos;

namespace MomentumCRM.Services.Auth;

public interface IAuthService {
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
}

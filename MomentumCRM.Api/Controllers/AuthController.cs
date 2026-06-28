using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Services.Auth;
using MomentumCRM.Services.Auth.Dtos;
using MomentumCRM.Services.Common.Exceptions;

namespace Api.Controllers {
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        IAuthService auth,
        IHostEnvironment env) : ControllerBase {
        private const string RefreshCookieName = "refreshToken";

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(
            RegisterRequest request,
            CancellationToken ct) =>
            IssueResponse(await auth.RegisterAsync(request, ct));

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(
            LoginRequest request,
            CancellationToken ct) =>
            IssueResponse(await auth.LoginAsync(request, ct));

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> Refresh(CancellationToken ct) {
            string? refreshToken = Request.Cookies[RefreshCookieName];
            if (string.IsNullOrEmpty(refreshToken))
                throw new InvalidRefreshTokenException();

            return IssueResponse(await auth.RefreshAsync(refreshToken, ct));
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout(CancellationToken ct) {
            string? refreshToken = Request.Cookies[RefreshCookieName];
            if (!string.IsNullOrEmpty(refreshToken))
                await auth.LogoutAsync(refreshToken, ct);

            Response.Cookies.Delete(RefreshCookieName, CookieOptions(DateTime.UtcNow));
            return NoContent();
        }

        private ActionResult<AuthResponse> IssueResponse(AuthResult result) {
            Response.Cookies.Append(
                RefreshCookieName,
                result.RefreshToken,
                CookieOptions(result.RefreshTokenExpiresAtUtc));

            return Ok(new AuthResponse(
                UserId: result.UserId,
                Email: result.Email,
                DisplayName: result.DisplayName,
                Role: result.Role,
                Token: result.AccessToken,
                ExpiresAtUtc: result.AccessTokenExpiresAtUtc));
        }

        private CookieOptions CookieOptions(DateTime expiresUtc) => new() {
            HttpOnly = true,
            Secure = !env.IsDevelopment(),
            SameSite = SameSiteMode.Lax,
            Expires = expiresUtc,
            Path = "/api/auth"
        };
    }
}

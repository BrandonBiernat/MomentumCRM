using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Services.Auth;
using MomentumCRM.Services.Auth.Dtos;

namespace Api.Controllers {
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService auth) : ControllerBase {
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(
            RegisterRequest request,
            CancellationToken ct) => Ok(await auth.RegisterAsync(request, ct));

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(
            LoginRequest request,
            CancellationToken ct) => Ok(await auth.LoginAsync(request, ct));
    }
}

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using MomentumCRM.Persistence.Abstractions;

namespace Api;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser {
    public Guid? Id {
        get {
            ClaimsPrincipal? user = httpContextAccessor.HttpContext?.User;
            string? sub =
                user?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? user?.FindFirstValue(JwtRegisteredClaimNames.Sub);

            return Guid.TryParse(sub, out Guid id) ? id : null;
        }
    }
}

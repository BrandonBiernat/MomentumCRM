using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Services.Settings;
using MomentumCRM.Services.Settings.Dtos;

namespace Api.Controllers {
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController(
        ISettingsService settings,
        ICurrentUser currentUser) : ControllerBase {
        [HttpGet]
        public async Task<ActionResult<UserSettingsResponse>> Get(CancellationToken ct) =>
            Ok(await settings.GetOrCreateAsync(RequireUserId(), ct));

        [HttpPut]
        public async Task<ActionResult<UserSettingsResponse>> Update(
            UpdateSettingsRequest request,
            CancellationToken ct) =>
            Ok(await settings.UpdateAsync(RequireUserId(), request, ct));

        private Guid RequireUserId() =>
            currentUser.Id ?? throw new UnauthorizedAccessException();
    }
}

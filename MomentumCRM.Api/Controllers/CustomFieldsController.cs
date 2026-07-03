using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Persistence.Enums.CustomFields;
using MomentumCRM.Services.CustomFields;
using MomentumCRM.Services.CustomFields.Dtos;

namespace Api.Controllers {
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomFieldsController(ICustomFieldDefinitionService definitions) : ControllerBase {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<CustomFieldDefinitionResponse>>> GetAll(
            [FromQuery] CustomFieldTarget? target,
            [FromQuery] bool archived,
            CancellationToken ct) =>
            Ok(await definitions.GetAllAsync(target, archived, ct));

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CustomFieldDefinitionResponse>> GetById(
            Guid id,
            CancellationToken ct) => Ok(await definitions.GetByIdAsync(id, ct));

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CustomFieldDefinitionResponse>> Create(
            CreateCustomFieldDefinitionRequest request,
            CancellationToken ct) {
            CustomFieldDefinitionResponse response = await definitions.CreateAsync(request, ct);
            return CreatedAtAction(
                nameof(GetById), new { id = response.Id }, response);
        }

        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CustomFieldDefinitionResponse>> Update(
            Guid id,
            UpdateCustomFieldDefinitionRequest request,
            CancellationToken ct) => Ok(await definitions.UpdateAsync(id, request, ct));

        [HttpPost("{id:guid}/archive")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Archive(Guid id, CancellationToken ct) {
            await definitions.ArchiveAsync(id, ct);
            return NoContent();
        }

        [HttpPost("{id:guid}/restore")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Restore(Guid id, CancellationToken ct) {
            await definitions.RestoreAsync(id, ct);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct) {
            await definitions.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}

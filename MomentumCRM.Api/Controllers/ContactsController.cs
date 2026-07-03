using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Services.Contacts;
using MomentumCRM.Services.Contacts.Dtos;

namespace Api.Controllers {
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController(IContactsService contacts) : ControllerBase {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ContactResponse>>> GetByCustomer(
            [FromQuery] Guid customerId,
            [FromQuery] bool archived,
            CancellationToken ct) =>
            Ok(await contacts.GetByCustomerAsync(customerId, archived, ct));

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ContactResponse>> GetById(
            Guid id,
            CancellationToken ct) => Ok(await contacts.GetByIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<ContactResponse>> Create(
            CreateContactRequest request,
            CancellationToken ct) {
            ContactResponse response = await contacts.CreateAsync(request, ct);
            return CreatedAtAction(
                nameof(GetById), new { id = response.Id }, response);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ContactResponse>> Update(
            Guid id,
            UpdateContactRequest request,
            CancellationToken ct) => Ok(await contacts.UpdateAsync(id, request, ct));

        [HttpPost("{id:guid}/primary")]
        public async Task<ActionResult<ContactResponse>> MakePrimary(
            Guid id,
            CancellationToken ct) => Ok(await contacts.MakePrimaryAsync(id, ct));

        [HttpPost("{id:guid}/archive")]
        public async Task<IActionResult> Archive(Guid id, CancellationToken ct) {
            await contacts.ArchiveAsync(id, ct);
            return NoContent();
        }

        [HttpPost("{id:guid}/restore")]
        public async Task<IActionResult> Restore(Guid id, CancellationToken ct) {
            await contacts.RestoreAsync(id, ct);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct) {
            await contacts.DeleteAsync(id, ct);
            return NoContent();
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Services.Customers;
using MomentumCRM.Services.Customers.Dtos;

namespace Api.Controllers {
    [Authorize]
    [Route("api/customers/{customerId:guid}/notes")]
    [ApiController]
    public class CustomerNotesController(INotesService notes) : ControllerBase {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<NoteResponse>>> GetAll(
            Guid customerId,
            CancellationToken ct) => Ok(await notes.GetAsync(customerId, ct));

        [HttpPost]
        public async Task<ActionResult<NoteResponse>> Create(
            Guid customerId,
            AddNoteRequest request,
            CancellationToken ct) => Ok(await notes.AddAsync(customerId, request, ct));

        [HttpPut("{noteId:guid}")]
        public async Task<ActionResult<NoteResponse>> Update(
            Guid customerId,
            Guid noteId,
            UpdateNoteRequest request,
            CancellationToken ct) => Ok(await notes.UpdateAsync(customerId, noteId, request, ct));

        [HttpDelete("{noteId:guid}")]
        public async Task<IActionResult> Delete(
            Guid customerId,
            Guid noteId,
            CancellationToken ct) {
            await notes.DeleteAsync(customerId, noteId, ct);
            return NoContent();
        }
    }
}

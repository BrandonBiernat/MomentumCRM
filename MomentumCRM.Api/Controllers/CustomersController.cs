using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Persistence.Enums.Customers;
using MomentumCRM.Services.Customers;
using MomentumCRM.Services.Customers.Dtos;

namespace Api.Controllers {
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController(ICustomersService customers) : ControllerBase {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<CustomerResponse>>> GetAll(
            [FromQuery] CustomerStatus? status,
            [FromQuery] bool archived,
            CancellationToken ct) =>
            Ok(await customers.GetAllAsync(status, archived, ct));

        [HttpGet("summary")]
        public async Task<ActionResult<CustomerSummaryResponse>> GetSummary(
            [FromQuery] bool archived,
            CancellationToken ct) =>
            Ok(await customers.GetSummaryAsync(archived, ct));

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CustomerResponse>> GetById(
            Guid id,
            CancellationToken ct) => Ok(await customers.GetByIdAsync(id, ct));

        [HttpPost]
        public async Task<ActionResult<CustomerResponse>> Create(
            CreateCustomerRequest request,
            CancellationToken ct) {
            CustomerResponse response = await
                customers.CreateAsync(request, ct);
            return CreatedAtAction(
                nameof(GetById), new { id = response.Id }, response);
        }

        [HttpPost("{id:guid}/archive")]
        public async Task<IActionResult> Archive(Guid id, CancellationToken ct) {
            await customers.ArchiveAsync(id, ct);
            return NoContent();
        }

        [HttpPost("{id:guid}/restore")]
        public async Task<IActionResult> Restore(Guid id, CancellationToken ct) {
            await customers.RestoreAsync(id, ct);
            return NoContent();
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<CustomerResponse>> Update(
            Guid id,
            UpdateCustomerRequest request,
            CancellationToken ct) => Ok(await customers.UpdateAsync(id, request, ct));

        [HttpPatch("{id:guid}")]
        public async Task<ActionResult<CustomerResponse>> Patch(
            Guid id,
            PatchCustomerRequest request,
            CancellationToken ct) => Ok(await customers.PatchAsync(id, request, ct));
    }
}
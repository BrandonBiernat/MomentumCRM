using Microsoft.AspNetCore.Mvc;
using MomentumCRM.Services.Customers;
using MomentumCRM.Services.Customers.Dtos;

namespace Api.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController(ICustomersService customers) : ControllerBase {
        [HttpPost]
        public async Task<ActionResult<CustomerResponse>> Create(
            CreateCustomerRequest request,
            CancellationToken ct) {
            CustomerResponse response = await
                customers.CreateAsync(request, ct);
            return CreatedAtAction(
                nameof(GetById), new { id = response.Id }, response);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<CustomerResponse>> Update(
            Guid id,
            UpdateCustomerRequest request,
            CancellationToken ct) => Ok(await customers.UpdateAsync(id, request, ct));
            
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<CustomerResponse>>> GetAll(CancellationToken ct) =>
            Ok(await customers.GetAllAsync(ct));

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CustomerResponse>> GetById(
            Guid id,
            CancellationToken ct) => Ok(await customers.GetByIdAsync(id, ct));
    }
}
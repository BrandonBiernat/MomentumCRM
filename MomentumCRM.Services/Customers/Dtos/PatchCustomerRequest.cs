using MomentumCRM.Persistence.Enums.Customers;
using MomentumCRM.Services.Common;

namespace MomentumCRM.Services.Customers.Dtos;

public record PatchCustomerRequest(
    string? Name,
    CustomerType? Type,
    CustomerSource? Source,
    CustomerStatus? Status,
    Optional<string> Email,
    Optional<string> Domain,
    Optional<UpdatePhoneRequest> Phone,
    Optional<UpdateAddressRequest> Address);

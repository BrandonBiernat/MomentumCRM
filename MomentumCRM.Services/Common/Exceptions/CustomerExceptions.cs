using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Services.Common.Exceptions;

public class CustomerAlreadyExistsException(string email) :
    Exception($"A customer with email '{email}' already exists");

public class CustomerNotFoundException(Guid id) :
    Exception($"Customer with id '{id}' was not found");

public class CustomerHasNoContactInfoException() :
    Exception($"Customer must have a phone number or email");

public class InvalidStatusTransitionException(CustomerStatus from, CustomerStatus to) :
    Exception($"Cannot change status from '{from}' to '{to}'");

public class StatusChangeReasonRequiredException() :
    Exception("A reason is required when marking a customer inactive");

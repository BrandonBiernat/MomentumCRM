using MomentumCRM.Persistence.Enums.Customers;

namespace MomentumCRM.Services.Common.Exceptions;

public class CustomerAlreadyExistsException(string email) :
    Exception($"A customer with email '{email}' already exists");

public class CustomerNotFoundException(Guid id) :
    Exception($"Customer with id '{id}' was not found");

public class CustomerArchivedException(Guid id) :
    Exception($"Customer with id '{id}' is archived and cannot be modified");

public class CustomerRestoreConflictException(string value) :
    Exception($"Cannot restore: another active customer already uses '{value}'");

public class CustomerHasNoContactInfoException() :
    Exception($"Customer must have a phone number or email");

public class InvalidStatusTransitionException(CustomerStatus from, CustomerStatus to) :
    Exception($"Cannot change status from '{from}' to '{to}'");

public class StatusChangeReasonRequiredException() :
    Exception("A reason is required when marking a customer inactive");

public class NoteNotFoundException(Guid id) :
    Exception($"Note with id '{id}' was not found");

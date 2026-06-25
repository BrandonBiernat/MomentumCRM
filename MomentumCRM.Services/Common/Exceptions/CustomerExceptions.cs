using MomentumCRM.Persistence.Entities;

namespace MomentumCRM.Services.Common.Exceptions;

public class CustomerAlreadyExistsException(string email) :
    Exception($"A customer with email '{email}' already exists");

public class CustomerNotFoundException(Guid id) :
    Exception($"Customer with id '{id}' was not found");

namespace MomentumCRM.Services.Common.Exceptions;

public class CustomerAlreadyExistsException(string email) :
    Exception($"A customer with email '{email}' already exists");

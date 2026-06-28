namespace MomentumCRM.Services.Common.Exceptions;

public class EmailAlreadyInUseException(string email) :
    Exception($"An account with email '{email}' already exists");

public class InvalidCredentialsException() :
    Exception("Invalid email or password");

public class InvalidRefreshTokenException() :
    Exception("Invalid or expired refresh token");

public class IdentityException(IEnumerable<string> errors) :
    Exception(string.Join("; ", errors));

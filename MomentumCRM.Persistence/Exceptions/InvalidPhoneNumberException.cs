namespace MomentumCRM.Persistence.Exceptions;

public class InvalidPhoneNumberException(string number) :
    Exception($"'{number}' is not a valid phone number");

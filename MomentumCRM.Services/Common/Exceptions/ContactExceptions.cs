namespace MomentumCRM.Services.Common.Exceptions;

public class ContactNotFoundException(Guid id) :
    Exception($"Contact with id '{id}' was not found");

public class ContactArchivedException(Guid id) :
    Exception($"Contact with id '{id}' is archived and cannot be modified");

public class ContactHasNoContactInfoException() :
    Exception("Contact must have a phone number or email");

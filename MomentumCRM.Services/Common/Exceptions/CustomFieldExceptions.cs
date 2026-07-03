using MomentumCRM.Persistence.Enums.CustomFields;

namespace MomentumCRM.Services.Common.Exceptions;

public class UnknownCustomFieldException(string key) :
    Exception($"No custom field is defined with key '{key}'");

public class CustomFieldTypeMismatchException(string label, CustomFieldType type) :
    Exception($"Custom field '{label}' expects a {type} value");

public class CustomFieldOptionInvalidException(string label, string value) :
    Exception($"'{value}' is not a valid option for custom field '{label}'");

public class RequiredCustomFieldMissingException(string label) :
    Exception($"Custom field '{label}' is required");

public class CustomFieldDefinitionNotFoundException(Guid id) :
    Exception($"Custom field definition with id '{id}' was not found");

public class DuplicateCustomFieldKeyException(string key) :
    Exception($"A custom field with key '{key}' already exists for this target");

using System.Globalization;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities.CustomFields;
using MomentumCRM.Persistence.Enums.CustomFields;
using MomentumCRM.Services.Common.Exceptions;

namespace MomentumCRM.Services.CustomFields;

public class CustomFieldWriter(MomentumCrmDbContext db) : ICustomFieldWriter {
    public async Task ApplyAsync(
        IHasCustomFields target,
        CustomFieldTarget targetType,
        IReadOnlyDictionary<string, JsonElement> values,
        CancellationToken ct = default) {
        List<CustomFieldDefinition> definitions = await db.CustomFieldDefinitions
            .Where(d => d.Target == targetType)
            .ToListAsync(ct);
        Dictionary<string, CustomFieldDefinition> byKey =
            definitions.ToDictionary(d => d.Key);

        foreach ((string key, JsonElement value) in values) {
            if (!byKey.TryGetValue(key, out CustomFieldDefinition? definition))
                throw new UnknownCustomFieldException(key);

            if (IsEmpty(value)) {
                target.CustomFields.Remove(key);
                continue;
            }

            Validate(definition, value);
            target.CustomFields.Set(key, value);
        }

        foreach (CustomFieldDefinition definition in definitions.Where(d => d.Required)) {
            bool present = target.CustomFields.TryGet(definition.Key, out JsonElement current)
                && !IsEmpty(current);
            if (!present)
                throw new RequiredCustomFieldMissingException(definition.Label);
        }
    }

    private static void Validate(CustomFieldDefinition definition, JsonElement value) {
        switch (definition.Type) {
            case CustomFieldType.Text:
                RequireKind(definition, value, JsonValueKind.String);
                break;
            case CustomFieldType.Number:
                RequireKind(definition, value, JsonValueKind.Number);
                break;
            case CustomFieldType.Boolean:
                if (value.ValueKind is not (JsonValueKind.True or JsonValueKind.False))
                    throw new CustomFieldTypeMismatchException(definition.Label, definition.Type);
                break;
            case CustomFieldType.Date:
                RequireKind(definition, value, JsonValueKind.String);
                if (!DateOnly.TryParse(value.GetString(), CultureInfo.InvariantCulture,
                        DateTimeStyles.None, out _))
                    throw new CustomFieldTypeMismatchException(definition.Label, definition.Type);
                break;
            case CustomFieldType.Select:
                RequireKind(definition, value, JsonValueKind.String);
                RequireOption(definition, value.GetString()!);
                break;
            case CustomFieldType.MultiSelect:
                if (value.ValueKind is not JsonValueKind.Array)
                    throw new CustomFieldTypeMismatchException(definition.Label, definition.Type);
                foreach (JsonElement element in value.EnumerateArray()) {
                    RequireKind(definition, element, JsonValueKind.String);
                    RequireOption(definition, element.GetString()!);
                }
                break;
        }
    }

    private static void RequireKind(
        CustomFieldDefinition definition, JsonElement value, JsonValueKind kind) {
        if (value.ValueKind != kind)
            throw new CustomFieldTypeMismatchException(definition.Label, definition.Type);
    }

    private static void RequireOption(CustomFieldDefinition definition, string value) {
        if (!definition.GetOptions().Contains(value))
            throw new CustomFieldOptionInvalidException(definition.Label, value);
    }

    private static bool IsEmpty(JsonElement value) =>
        value.ValueKind switch {
            JsonValueKind.Null or JsonValueKind.Undefined => true,
            JsonValueKind.String => string.IsNullOrWhiteSpace(value.GetString()),
            JsonValueKind.Array => value.GetArrayLength() == 0,
            _ => false
        };
}

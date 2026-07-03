using System.Text.Json;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Enums.CustomFields;

namespace MomentumCRM.Services.CustomFields;

public interface ICustomFieldWriter {
    // Validates the incoming values against the active definitions for targetType
    // and applies them to the entity. Patch semantics: only the supplied keys are
    // touched, but every Required field must resolve to a non-empty value on the
    // merged result. Throws on unknown keys, type mismatches, or invalid options.
    Task ApplyAsync(
        IHasCustomFields target,
        CustomFieldTarget targetType,
        IReadOnlyDictionary<string, JsonElement> values,
        CancellationToken ct = default);
}

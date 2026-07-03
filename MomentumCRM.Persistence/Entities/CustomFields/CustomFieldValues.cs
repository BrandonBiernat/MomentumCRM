using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MomentumCRM.Persistence.Entities.CustomFields;

public sealed class CustomFieldValues {
    private readonly Dictionary<string, JsonElement> _values;

    public CustomFieldValues() {
        _values = [];
    }

    private CustomFieldValues(Dictionary<string, JsonElement> values) {
        _values = values;
    }

    public IReadOnlyDictionary<string, JsonElement> Values => _values;

    public bool TryGet(string key, out JsonElement value) =>
        _values.TryGetValue(key, out value);

    public void Set(string key, JsonElement value) {
        _values[key] = value;
    }

    public void Remove(string key) {
        _values.Remove(key);
    }

    public string Serialize() =>
        JsonSerializer.Serialize(_values);

    public static CustomFieldValues Deserialize(string? json) {
        if (string.IsNullOrWhiteSpace(json))
            return new CustomFieldValues();

        Dictionary<string, JsonElement>? parsed =
            JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json);
        return new CustomFieldValues(parsed ?? []);
    }

    public CustomFieldValues Clone() =>
        Deserialize(Serialize());

    public sealed class EFConverter() : ValueConverter<CustomFieldValues, string>(
        values => values.Serialize(),
        json => Deserialize(json)) {
    }

    public sealed class EFComparer() : ValueComparer<CustomFieldValues>(
        (a, b) => (a == null ? "" : a.Serialize()) == (b == null ? "" : b.Serialize()),
        v => v.Serialize().GetHashCode(),
        v => v.Clone()) {
    }
}

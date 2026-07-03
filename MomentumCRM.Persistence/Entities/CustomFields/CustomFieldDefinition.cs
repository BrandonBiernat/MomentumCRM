using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Enums.CustomFields;

namespace MomentumCRM.Persistence.Entities.CustomFields;

public readonly record struct CustomFieldDefinitionId(Guid Value) {
    public static CustomFieldDefinitionId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();

    public sealed class EFConverter() : ValueConverter<CustomFieldDefinitionId, Guid>(
        id => id.Value,
        value => new CustomFieldDefinitionId(value)) {
    }
}

public class CustomFieldDefinition : IEntity<CustomFieldDefinitionId>, IAuditable {
    public CustomFieldDefinitionId Id { get; private set; }
    public CustomFieldTarget Target { get; private set; }
    public string Key { get; private set; }
    public string Label { get; private set; }
    public CustomFieldType Type { get; private set; }
    public bool Required { get; private set; }
    public string? OptionsJson { get; private set; }
    public int SortOrder { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public Guid? UpdatedBy { get; private set; }
    public Guid? ArchivedBy { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }
    public DateTime? ArchivedAtUtc { get; private set; }

    public bool IsArchived => ArchivedAtUtc is not null;
    public bool HasOptions => Type is CustomFieldType.Select or CustomFieldType.MultiSelect;

    private CustomFieldDefinition() {
        Key = null!;
        Label = null!;
    }

    public CustomFieldDefinition(
        CustomFieldTarget target,
        string key,
        string label,
        CustomFieldType type,
        bool required = false,
        IReadOnlyList<string>? options = null,
        int sortOrder = 0) {
        if (string.IsNullOrWhiteSpace(key))
            throw new ArgumentException("Key is required", nameof(key));
        if (string.IsNullOrWhiteSpace(label))
            throw new ArgumentException("Label is required", nameof(label));

        bool hasOptions = type is CustomFieldType.Select or CustomFieldType.MultiSelect;
        if (hasOptions && (options is null || options.Count == 0))
            throw new ArgumentException("Select fields require at least one option", nameof(options));

        Id = CustomFieldDefinitionId.New();
        Target = target;
        Key = key.Trim();
        Label = label.Trim();
        Type = type;
        Required = required;
        OptionsJson = hasOptions ? JsonSerializer.Serialize(options) : null;
        SortOrder = sortOrder;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public IReadOnlyList<string> GetOptions() =>
        OptionsJson is null
            ? []
            : JsonSerializer.Deserialize<List<string>>(OptionsJson) ?? [];

    public void Rename(string label) {
        Label = label.Trim();
    }

    public void ChangeRequired(bool required) {
        Required = required;
    }

    public void ChangeSortOrder(int sortOrder) {
        SortOrder = sortOrder;
    }

    public void ChangeOptions(IReadOnlyList<string> options) {
        if (!HasOptions)
            throw new InvalidOperationException("Only Select fields have options");
        if (options.Count == 0)
            throw new ArgumentException("Select fields require at least one option", nameof(options));
        OptionsJson = JsonSerializer.Serialize(options);
    }

    public void Archive(Guid? archivedBy) {
        if (ArchivedAtUtc is not null)
            return;
        ArchivedAtUtc = DateTime.UtcNow;
        ArchivedBy = archivedBy;
    }

    public void Restore() {
        ArchivedAtUtc = null;
        ArchivedBy = null;
    }
}

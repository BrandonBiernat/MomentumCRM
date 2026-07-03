using System.ComponentModel.DataAnnotations;
using MomentumCRM.Persistence.Entities.CustomFields;
using MomentumCRM.Persistence.Enums.CustomFields;

namespace MomentumCRM.Services.CustomFields.Dtos;

public record CreateCustomFieldDefinitionRequest(
    [Required] CustomFieldTarget Target,
    [Required, MaxLength(100)] string Key,
    [Required, MaxLength(150)] string Label,
    [Required] CustomFieldType Type,
    bool Required,
    IReadOnlyList<string>? Options,
    int SortOrder);

public record UpdateCustomFieldDefinitionRequest(
    [Required, MaxLength(150)] string Label,
    bool Required,
    IReadOnlyList<string>? Options,
    int SortOrder);

public record CustomFieldDefinitionResponse(
    Guid Id,
    CustomFieldTarget Target,
    string Key,
    string Label,
    CustomFieldType Type,
    bool Required,
    IReadOnlyList<string> Options,
    int SortOrder,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc,
    DateTime? ArchivedAtUtc
) {
    public static CustomFieldDefinitionResponse FromEntity(CustomFieldDefinition d) =>
        new(
            d.Id.Value,
            d.Target,
            d.Key,
            d.Label,
            d.Type,
            d.Required,
            d.GetOptions(),
            d.SortOrder,
            d.CreatedAtUtc,
            d.UpdatedAtUtc,
            d.ArchivedAtUtc);
}

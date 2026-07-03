using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities.CustomFields;
using MomentumCRM.Persistence.Enums.CustomFields;
using MomentumCRM.Services.Common.Exceptions;
using MomentumCRM.Services.CustomFields.Dtos;

namespace MomentumCRM.Services.CustomFields;

public class CustomFieldDefinitionService(MomentumCrmDbContext db) : ICustomFieldDefinitionService {
    public async Task<CustomFieldDefinitionResponse> CreateAsync(
        CreateCustomFieldDefinitionRequest request,
        CancellationToken ct = default) {
        RequireOptionsWhenSelect(request.Type, request.Options, request.Label);

        string key = request.Key.Trim();
        bool exists = await db.CustomFieldDefinitions
            .AnyAsync(d => d.Target == request.Target && d.Key == key, ct);
        if (exists)
            throw new DuplicateCustomFieldKeyException(key);

        CustomFieldDefinition definition = new(
            target: request.Target,
            key: request.Key,
            label: request.Label,
            type: request.Type,
            required: request.Required,
            options: request.Options,
            sortOrder: request.SortOrder);

        db.CustomFieldDefinitions.Add(definition);
        await db.SaveChangesAsync(ct);
        return CustomFieldDefinitionResponse.FromEntity(definition);
    }

    public async Task<CustomFieldDefinitionResponse> UpdateAsync(
        Guid id,
        UpdateCustomFieldDefinitionRequest request,
        CancellationToken ct = default) {
        CustomFieldDefinition definition = await db.CustomFieldDefinitions
            .FindAsync([new CustomFieldDefinitionId(id)], ct)
                ?? throw new CustomFieldDefinitionNotFoundException(id);

        definition.Rename(request.Label);
        definition.ChangeRequired(request.Required);
        definition.ChangeSortOrder(request.SortOrder);

        if (definition.HasOptions) {
            RequireOptionsWhenSelect(definition.Type, request.Options, definition.Label);
            definition.ChangeOptions(request.Options!);
        }

        await db.SaveChangesAsync(ct);
        return CustomFieldDefinitionResponse.FromEntity(definition);
    }

    public async Task<CustomFieldDefinitionResponse> GetByIdAsync(
        Guid id,
        CancellationToken ct = default) {
        CustomFieldDefinition definition = await db.CustomFieldDefinitions
            .IgnoreQueryFilters()
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == new CustomFieldDefinitionId(id), ct)
                ?? throw new CustomFieldDefinitionNotFoundException(id);
        return CustomFieldDefinitionResponse.FromEntity(definition);
    }

    public async Task<IReadOnlyList<CustomFieldDefinitionResponse>> GetAllAsync(
        CustomFieldTarget? target,
        bool archived,
        CancellationToken ct = default) {
        IQueryable<CustomFieldDefinition> query = archived
            ? db.CustomFieldDefinitions.IgnoreQueryFilters().Where(d => d.ArchivedAtUtc != null)
            : db.CustomFieldDefinitions;

        if (target is not null)
            query = query.Where(d => d.Target == target);

        List<CustomFieldDefinition> definitions = await query
            .OrderBy(d => d.Target)
            .ThenBy(d => d.SortOrder)
            .ThenBy(d => d.Label)
            .AsNoTracking()
            .ToListAsync(ct);
        return [.. definitions.Select(CustomFieldDefinitionResponse.FromEntity)];
    }

    public async Task ArchiveAsync(
        Guid id,
        CancellationToken ct = default) {
        CustomFieldDefinition definition = await db.CustomFieldDefinitions
            .FirstOrDefaultAsync(d => d.Id == new CustomFieldDefinitionId(id), ct)
                ?? throw new CustomFieldDefinitionNotFoundException(id);

        definition.Archive(null);
        await db.SaveChangesAsync(ct);
    }

    public async Task RestoreAsync(
        Guid id,
        CancellationToken ct = default) {
        CustomFieldDefinition definition = await db.CustomFieldDefinitions
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(d => d.Id == new CustomFieldDefinitionId(id) && d.ArchivedAtUtc != null, ct)
                ?? throw new CustomFieldDefinitionNotFoundException(id);

        bool keyInUse = await db.CustomFieldDefinitions
            .AnyAsync(d => d.Target == definition.Target && d.Key == definition.Key, ct);
        if (keyInUse)
            throw new DuplicateCustomFieldKeyException(definition.Key);

        definition.Restore();
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(
        Guid id,
        CancellationToken ct = default) {
        CustomFieldDefinition definition = await db.CustomFieldDefinitions
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(d => d.Id == new CustomFieldDefinitionId(id) && d.ArchivedAtUtc != null, ct)
                ?? throw new CustomFieldDefinitionNotFoundException(id);

        db.CustomFieldDefinitions.Remove(definition);
        await db.SaveChangesAsync(ct);
    }

    private static void RequireOptionsWhenSelect(
        CustomFieldType type,
        IReadOnlyList<string>? options,
        string label) {
        bool needsOptions = type is CustomFieldType.Select or CustomFieldType.MultiSelect;
        if (needsOptions && (options is null || options.Count == 0))
            throw new CustomFieldOptionsRequiredException(label);
    }
}

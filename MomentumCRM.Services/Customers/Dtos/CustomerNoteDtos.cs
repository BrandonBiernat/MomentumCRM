using System.ComponentModel.DataAnnotations;
using MomentumCRM.Persistence.Entities.Customers;

namespace MomentumCRM.Services.Customers.Dtos;

public record AddNoteRequest([Required, MaxLength(4000)] string Body);

public record UpdateNoteRequest([Required, MaxLength(4000)] string Body);

public record NoteResponse(
    Guid Id,
    string Body,
    Guid? CreatedBy,
    DateTime CreatedAtUtc,
    Guid? UpdatedBy,
    DateTime? UpdatedAtUtc
) {
    public static NoteResponse FromEntity(CustomerNote note) =>
        new(note.Id.Value, note.Body, note.CreatedBy, note.CreatedAtUtc, note.UpdatedBy, note.UpdatedAtUtc);
}

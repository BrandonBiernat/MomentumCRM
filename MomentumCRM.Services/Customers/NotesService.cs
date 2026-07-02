using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities.Customers;
using MomentumCRM.Services.Common.Exceptions;
using MomentumCRM.Services.Customers.Dtos;
using MomentumCRM.Services.Events;

namespace MomentumCRM.Services.Customers;

public class NotesService(
    MomentumCrmDbContext db,
    ICurrentUser currentUser,
    IEventPublisher events) : INotesService {

    public async Task<IReadOnlyList<NoteResponse>> GetAsync(
        Guid customerId,
        CancellationToken ct = default) {
        CustomerId cid = new(customerId);
        List<CustomerNote> notes = await db.CustomerNotes
            .AsNoTracking()
            .Where(n => n.CustomerId == cid)
            .OrderByDescending(n => n.CreatedAtUtc)
            .ToListAsync(ct);
        return [.. notes.Select(NoteResponse.FromEntity)];
    }

    public async Task<NoteResponse> AddAsync(
        Guid customerId,
        AddNoteRequest request,
        CancellationToken ct = default) {
        CustomerId cid = new(customerId);
        bool customerExists = await db.Customers.AnyAsync(c => c.Id == cid, ct);
        if (!customerExists)
            throw new CustomerNotFoundException(customerId);

        CustomerNote note = new(cid, request.Body);
        db.CustomerNotes.Add(note);

        await events.PublishAsync(new NoteAdded(customerId, Preview(note.Body), currentUser.Id), ct);
        await db.SaveChangesAsync(ct);
        return NoteResponse.FromEntity(note);
    }

    public async Task<NoteResponse> UpdateAsync(
        Guid customerId,
        Guid noteId,
        UpdateNoteRequest request,
        CancellationToken ct = default) {
        CustomerNote note = await FindAsync(customerId, noteId, ct);
        note.UpdateBody(request.Body);
        await db.SaveChangesAsync(ct);
        return NoteResponse.FromEntity(note);
    }

    public async Task DeleteAsync(
        Guid customerId,
        Guid noteId,
        CancellationToken ct = default) {
        CustomerNote note = await FindAsync(customerId, noteId, ct);
        db.CustomerNotes.Remove(note);
        await events.PublishAsync(new NoteRemoved(customerId, Preview(note.Body), currentUser.Id), ct);
        await db.SaveChangesAsync(ct);
    }

    private async Task<CustomerNote> FindAsync(Guid customerId, Guid noteId, CancellationToken ct) =>
        await db.CustomerNotes.FirstOrDefaultAsync(
            n => n.Id == new CustomerNoteId(noteId) && n.CustomerId == new CustomerId(customerId), ct)
        ?? throw new NoteNotFoundException(noteId);

    private static string Preview(string body) =>
        body.Length <= 140 ? body : string.Concat(body.AsSpan(0, 140).TrimEnd(), "…");
}

using MomentumCRM.Services.Customers.Dtos;

namespace MomentumCRM.Services.Customers;

public interface INotesService {
    Task<IReadOnlyList<NoteResponse>> GetAsync(Guid customerId, CancellationToken ct = default);
    Task<NoteResponse> AddAsync(Guid customerId, AddNoteRequest request, CancellationToken ct = default);
    Task<NoteResponse> UpdateAsync(
        Guid customerId,
        Guid noteId,
        UpdateNoteRequest request,
        CancellationToken ct = default);
    Task DeleteAsync(Guid customerId, Guid noteId, CancellationToken ct = default);
}

using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MomentumCRM.Persistence.Abstractions;
using MomentumCRM.Persistence.Contexts;
using MomentumCRM.Persistence.Entities.Contacts;
using MomentumCRM.Persistence.Entities.Customers;
using MomentumCRM.Persistence.Enums.CustomFields;
using MomentumCRM.Services.Common.Exceptions;
using MomentumCRM.Services.Contacts.Dtos;
using MomentumCRM.Services.CustomFields;

namespace MomentumCRM.Services.Contacts;

public class ContactsService(
    MomentumCrmDbContext db,
    ICurrentUser currentUser,
    ICustomFieldWriter customFields) : IContactsService {
    private static readonly IReadOnlyDictionary<string, JsonElement> NoCustomFields =
        new Dictionary<string, JsonElement>();

    public async Task<ContactResponse> CreateAsync(
        CreateContactRequest request,
        CancellationToken ct = default) {
        if (string.IsNullOrWhiteSpace(request.Email) && request.Phone is null)
            throw new ContactHasNoContactInfoException();

        CustomerId customerId = new(request.CustomerId);
        bool customerExists = await db.Customers.AnyAsync(c => c.Id == customerId, ct);
        if (!customerExists)
            throw new CustomerNotFoundException(request.CustomerId);

        Contact contact = new(
            customerId: customerId,
            firstName: request.FirstName,
            lastName: request.LastName,
            email: request.Email,
            phone: request.Phone?.ToValueObject(),
            preferredName: request.PreferredName,
            jobTitle: request.JobTitle);

        await customFields.ApplyAsync(
            contact, CustomFieldTarget.Contact, request.CustomFields ?? NoCustomFields, ct);

        bool isFirst = !await db.Contacts.AnyAsync(c => c.CustomerId == customerId, ct);
        if (request.IsPrimary || isFirst) {
            await DemoteCurrentPrimaryAsync(customerId, null, ct);
            contact.MarkPrimary();
        }

        db.Contacts.Add(contact);
        await db.SaveChangesAsync(ct);
        return ContactResponse.FromEntity(contact);
    }

    public async Task<ContactResponse> UpdateAsync(
        Guid id,
        UpdateContactRequest request,
        CancellationToken ct = default) {
        Contact contact = await db.Contacts
            .FindAsync([new ContactId(id)], ct)
                ?? throw new ContactNotFoundException(id);

        if (contact.IsArchived)
            throw new ContactArchivedException(id);
        if (string.IsNullOrWhiteSpace(request.Email) && request.Phone is null)
            throw new ContactHasNoContactInfoException();

        contact.ChangeName(request.FirstName, request.LastName);
        contact.ChangeEmail(request.Email);
        contact.ChangePhone(request.Phone?.ToValueObject());
        contact.ChangePreferredName(request.PreferredName);
        contact.ChangeJobTitle(request.JobTitle);

        await customFields.ApplyAsync(
            contact, CustomFieldTarget.Contact, request.CustomFields ?? NoCustomFields, ct);

        if (request.IsPrimary && !contact.IsPrimary) {
            await DemoteCurrentPrimaryAsync(contact.CustomerId, contact.Id, ct);
            contact.MarkPrimary();
        } else if (!request.IsPrimary && contact.IsPrimary) {
            contact.UnmarkPrimary();
        }

        await db.SaveChangesAsync(ct);
        return ContactResponse.FromEntity(contact);
    }

    public async Task<ContactResponse> MakePrimaryAsync(
        Guid id,
        CancellationToken ct = default) {
        Contact contact = await db.Contacts
            .FindAsync([new ContactId(id)], ct)
                ?? throw new ContactNotFoundException(id);

        if (contact.IsArchived)
            throw new ContactArchivedException(id);

        if (!contact.IsPrimary) {
            await DemoteCurrentPrimaryAsync(contact.CustomerId, contact.Id, ct);
            contact.MarkPrimary();
            await db.SaveChangesAsync(ct);
        }

        return ContactResponse.FromEntity(contact);
    }

    public async Task<ContactResponse> GetByIdAsync(
        Guid id,
        CancellationToken ct = default) {
        Contact contact = await db.Contacts
            .IgnoreQueryFilters()
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == new ContactId(id), ct)
                ?? throw new ContactNotFoundException(id);
        return ContactResponse.FromEntity(contact);
    }

    public async Task<IReadOnlyList<ContactResponse>> GetByCustomerAsync(
        Guid customerId,
        bool archived,
        CancellationToken ct = default) {
        CustomerId cid = new(customerId);
        IQueryable<Contact> query = archived
            ? db.Contacts.IgnoreQueryFilters().Where(c => c.CustomerId == cid && c.ArchivedAtUtc != null)
            : db.Contacts.Where(c => c.CustomerId == cid);

        List<Contact> contacts = await query
            .OrderByDescending(c => c.IsPrimary)
            .ThenBy(c => c.LastName)
            .AsNoTracking()
            .ToListAsync(ct);
        return [.. contacts.Select(ContactResponse.FromEntity)];
    }

    public async Task ArchiveAsync(
        Guid id,
        CancellationToken ct = default) {
        Contact contact = await db.Contacts
            .FirstOrDefaultAsync(c => c.Id == new ContactId(id), ct)
                ?? throw new ContactNotFoundException(id);

        contact.Archive(currentUser.Id);
        contact.UnmarkPrimary();
        await db.SaveChangesAsync(ct);
    }

    public async Task RestoreAsync(
        Guid id,
        CancellationToken ct = default) {
        Contact contact = await db.Contacts
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(c => c.Id == new ContactId(id) && c.ArchivedAtUtc != null, ct)
                ?? throw new ContactNotFoundException(id);

        contact.Restore();
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(
        Guid id,
        CancellationToken ct = default) {
        Contact contact = await db.Contacts
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(c => c.Id == new ContactId(id) && c.ArchivedAtUtc != null, ct)
                ?? throw new ContactNotFoundException(id);

        db.Contacts.Remove(contact);
        await db.SaveChangesAsync(ct);
    }

    private async Task DemoteCurrentPrimaryAsync(
        CustomerId customerId,
        ContactId? except,
        CancellationToken ct) {
        List<Contact> primaries = await db.Contacts
            .Where(c => c.CustomerId == customerId && c.IsPrimary)
            .ToListAsync(ct);

        foreach (Contact primary in primaries) {
            if (except is not null && primary.Id == except.Value)
                continue;
            primary.UnmarkPrimary();
        }
    }
}

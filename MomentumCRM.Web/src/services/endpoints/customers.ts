import type {
    AddNoteRequest,
    ChangeStatusRequest,
    CreateCustomerRequest,
    Customer,
    CustomerActivity,
    CustomerNote,
    CustomerStatus,
    CustomerSummary,
    PatchCustomerRequest,
    UpdateCustomerRequest,
    UpdateNoteRequest,
} from "../../types/customer";
import { baseApi } from "../baseApi";

const LIST = { type: 'Customer' as const, id: 'LIST' }
const SUMMARY = { type: 'Customer' as const, id: 'SUMMARY' }

type CustomerListArgs = { status?: CustomerStatus; archived?: boolean }

export const customersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCustomers: builder.query<Customer[], CustomerListArgs>({
            query: (arg) => ({
                url: 'api/customers',
                params: { status: arg?.status, archived: arg?.archived },
            }),
            providesTags: (result) =>
                result
                    ? [...result.map((c) => ({ type: 'Customer' as const, id: c.id })), LIST]
                    : [LIST]
        }),
        getCustomerSummary: builder.query<CustomerSummary, { archived?: boolean }>({
            query: (arg) => ({
                url: 'api/customers/summary',
                params: { archived: arg?.archived },
            }),
            providesTags: [SUMMARY]
        }),
        getCustomerById: builder.query<Customer, string>({
            query: (id) => `api/customers/${id}`,
            providesTags: (_r, _e, id) => [{ type: 'Customer', id }],
        }),
        getCustomerActivity: builder.query<CustomerActivity[], string>({
            query: (id) => `api/customers/${id}/activity`,
            providesTags: (_r, _e, id) => [{ type: 'CustomerActivity', id }]
        }),
        getCustomerNotes: builder.query<CustomerNote[], string>({
            query: (customerId) => `api/customers/${customerId}/notes`,
            providesTags: (_r, _e, customerId) => [{ type: 'CustomerNote', id: customerId }]
        }),
        
        createCustomer: builder.mutation<Customer, CreateCustomerRequest>({
            query: (body) => ({
                url: 'api/customers',
                method: 'POST',
                body
            }),
            invalidatesTags: [LIST, SUMMARY]
        }),
        archiveCustomer: builder.mutation<void, string>({
            query: (id) => ({
                url: `api/customers/${id}/archive`,
                method: 'POST',
            }),
            invalidatesTags: (_r, _e, id) => [{ type: 'Customer', id }, LIST, SUMMARY]
        }),
        restoreCustomer: builder.mutation<void, string>({
            query: (id) => ({
                url: `api/customers/${id}/restore`,
                method: 'POST',
            }),
            invalidatesTags: (_r, _e, id) => [{ type: 'Customer', id }, LIST, SUMMARY]
        }),
        updateCustomer: builder.mutation<Customer, { id: string, body: UpdateCustomerRequest }>({
            query: ({ id, body }) => ({
                url: `api/customers/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (_r, _e, { id }) => [{ type: 'Customer', id }, LIST, SUMMARY]
        }),
        patchCustomer: builder.mutation<Customer, { id: string, body: PatchCustomerRequest }>({
            query: ({ id, body }) => ({
                url: `api/customers/${id}`,
                method: 'PATCH',
                body
            }),
            onQueryStarted: async ({ id, body }, { dispatch, queryFulfilled }) => {
                const patch = dispatch(
                    customersApi.util.updateQueryData('getCustomerById', id, (draft) => {
                        Object.assign(draft, body)
                    }),
                )
                try {
                    await queryFulfilled
                } catch {
                    patch.undo()
                }
            },
            invalidatesTags: (_r, _e, { id }) => [{ type: 'Customer', id }, LIST, SUMMARY]
        }),
        changeCustomerStatus: builder.mutation<Customer, { id: string, body: ChangeStatusRequest }>({
            query: ({ id, body }) => ({
                url: `api/customers/${id}/status`,
                method: 'POST',
                body
            }),
            // Refresh the customer (new status), the list/summary counts, and
            // the activity timeline (a new entry was logged).
            invalidatesTags: (_r, _e, { id }) => [
                { type: 'Customer', id },
                { type: 'CustomerActivity', id },
                LIST,
                SUMMARY,
            ]
        }),
        addCustomerNote: builder.mutation<CustomerNote, { customerId: string, body: AddNoteRequest }>({
            query: ({ customerId, body }) => ({
                url: `api/customers/${customerId}/notes`,
                method: 'POST',
                body
            }),
            // A new note also logs a NoteAdded activity, so refresh both.
            invalidatesTags: (_r, _e, { customerId }) => [
                { type: 'CustomerNote', id: customerId },
                { type: 'CustomerActivity', id: customerId },
            ]
        }),
        updateCustomerNote: builder.mutation<CustomerNote, { customerId: string, noteId: string, body: UpdateNoteRequest }>({
            query: ({ customerId, noteId, body }) => ({
                url: `api/customers/${customerId}/notes/${noteId}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (_r, _e, { customerId }) => [{ type: 'CustomerNote', id: customerId }]
        }),
        deleteCustomerNote: builder.mutation<void, { customerId: string, noteId: string }>({
            query: ({ customerId, noteId }) => ({
                url: `api/customers/${customerId}/notes/${noteId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_r, _e, { customerId }) => [
                { type: 'CustomerNote', id: customerId },
                { type: 'CustomerActivity', id: customerId },
            ]
        }),
    }),
    overrideExisting: false,
})

export const {
    useGetCustomersQuery,
    useGetCustomerSummaryQuery,
    useGetCustomerByIdQuery,

    useCreateCustomerMutation,
    useArchiveCustomerMutation,
    useRestoreCustomerMutation,

    useUpdateCustomerMutation,
    usePatchCustomerMutation,

    useChangeCustomerStatusMutation,
    useGetCustomerActivityQuery,

    useGetCustomerNotesQuery,
    useAddCustomerNoteMutation,
    useUpdateCustomerNoteMutation,
    useDeleteCustomerNoteMutation
} = customersApi;

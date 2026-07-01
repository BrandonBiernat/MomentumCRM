import type {
    CreateCustomerRequest,
    Customer,
    CustomerStatus,
    CustomerSummary,
    UpdateCustomerRequest,
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

    useUpdateCustomerMutation
} = customersApi;

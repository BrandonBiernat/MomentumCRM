import type { Address, Phone } from "./misc"

// Enums
export type CustomerType = 'Individual' | 'Business'
export type CustomerStatus = 'Lead' | 'Prospect' | 'Active' | 'Inactive'
export type CustomerSource = 
    | 'OrganicSearch' | 'PaidSearch' | 'PaidSocial' | 'OrganicSocial'
    | 'ContentBlog' | 'EmailCampaign' | 'WebinarEvent' | 'Direct'
    | 'ColdOutbound' | 'WalkIn' | 'CustomerReferral' | 'PartnerAffiliate'
    | 'WordOfMouth' | 'TradeShowConference' | 'ColdCall' | 'LinkedInOutreach'
    | 'FreeTrial' | 'ProductSignup' | 'ApiDeveloperSignup' | 'PressOrPR'
    | 'ReviewSite' | 'Unknown'

// Types
export type Customer = {
    id: string
    name: string
    email: string | null
    phone: Phone | null
    domain: string | null
    address: Address | null
    type: CustomerType
    source: CustomerSource
    status: CustomerStatus
    createdAtUtc: string
    updatedAtUtc: string | null
    archivedAtUtc: string | null
}

export type CreateCustomerRequest = {
    name: string
    type: CustomerType
    source: CustomerSource
    email?: string
    phone?: Phone
}

// Partial update. Omit a key to leave it unchanged; send null to clear
// (email/phone/domain/address only). Status is NOT here — it goes through the
// status workflow endpoint so transitions are validated and logged.
export type PatchCustomerRequest = {
    name?: string
    type?: CustomerType
    source?: CustomerSource
    email?: string | null
    domain?: string | null
    phone?: Phone | null
    address?: Address | null
}

export type ChangeStatusRequest = {
    status: CustomerStatus
    reason?: string
}

// The status lifecycle state machine — mirrors the server's rules so the UI
// only offers valid next steps.
export const allowedStatusTransitions: Record<CustomerStatus, CustomerStatus[]> = {
    Lead: ['Prospect', 'Inactive'],
    Prospect: ['Lead', 'Active', 'Inactive'],
    Active: ['Inactive'],
    Inactive: ['Lead', 'Prospect', 'Active'],
}

export const statusReasonRequired = (status: CustomerStatus): boolean => status === 'Inactive'

export type CustomerActivityType = 'Created' | 'StatusChanged' | 'NoteAdded' | 'NoteRemoved'

export type CustomerNote = {
    id: string
    body: string
    createdBy: string | null
    createdAtUtc: string
    updatedBy: string | null
    updatedAtUtc: string | null
}

export type AddNoteRequest = { body: string }
export type UpdateNoteRequest = { body: string }

export type CustomerActivity = {
    id: string
    type: CustomerActivityType
    data: Record<string, unknown> | null
    actorId: string | null
    occurredAtUtc: string
}

export type CustomerSummary = {
    all: number
    lead: number
    prospect: number
    active: number
    inactive: number
}

export type UpdateCustomerRequest = {
    name: string
    type: CustomerType
    email?: string
    phone?: Phone
    domain?: string
    address?: Address
    source?: CustomerSource
}
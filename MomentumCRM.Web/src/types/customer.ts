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
// (email/phone/domain/address only — name/type/source/status can't be cleared).
export type PatchCustomerRequest = {
    name?: string
    type?: CustomerType
    source?: CustomerSource
    status?: CustomerStatus
    email?: string | null
    domain?: string | null
    phone?: Phone | null
    address?: Address | null
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
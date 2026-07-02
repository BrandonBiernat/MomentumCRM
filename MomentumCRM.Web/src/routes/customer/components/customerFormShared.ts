import type { SelectOption } from '../../../components'

export const typeOptions: SelectOption[] = [
  { id: 'Business', label: 'Business' },
  { id: 'Individual', label: 'Individual' },
]

export const sourceOptions: SelectOption[] = [
  { id: 'OrganicSearch', label: 'Organic Search' },
  { id: 'PaidSearch', label: 'Paid Search' },
  { id: 'PaidSocial', label: 'Paid Social' },
  { id: 'OrganicSocial', label: 'Organic Social' },
  { id: 'ContentBlog', label: 'Content / Blog' },
  { id: 'EmailCampaign', label: 'Email Campaign' },
  { id: 'WebinarEvent', label: 'Webinar / Event' },
  { id: 'Direct', label: 'Direct' },
  { id: 'ColdOutbound', label: 'Cold Outbound' },
  { id: 'WalkIn', label: 'Walk-in' },
  { id: 'CustomerReferral', label: 'Customer Referral' },
  { id: 'PartnerAffiliate', label: 'Partner / Affiliate' },
  { id: 'WordOfMouth', label: 'Word of Mouth' },
  { id: 'TradeShowConference', label: 'Trade Show / Conference' },
  { id: 'ColdCall', label: 'Cold Call' },
  { id: 'LinkedInOutreach', label: 'LinkedIn Outreach' },
  { id: 'FreeTrial', label: 'Free Trial' },
  { id: 'ProductSignup', label: 'Product Signup' },
  { id: 'ApiDeveloperSignup', label: 'API / Developer Signup' },
  { id: 'PressOrPR', label: 'Press / PR' },
  { id: 'ReviewSite', label: 'Review Site' },
  { id: 'Unknown', label: 'Unknown' },
]

// Enum value -> human label, for display outside of a Select.
export const sourceLabels: Record<string, string> = Object.fromEntries(
  sourceOptions.map((o) => [String(o.id), o.label]),
)

export const getFormErrorMessage = (err: unknown): string => {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { title?: string } }).data
    if (data?.title) return data.title
  }
  return 'Something went wrong. Please try again.'
}

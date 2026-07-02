import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Form,
  Message,
  Select,
  TextField,
  toast,
  type FormSubmitHandler,
  type SelectOption,
} from '../../../components'
import { useCreateCustomerMutation } from '../../../services'
import type { CustomerSource, CustomerType } from '../../../types/customer'

const typeOptions: SelectOption[] = [
  { id: 'Business', label: 'Business' },
  { id: 'Individual', label: 'Individual' },
]

const sourceOptions: SelectOption[] = [
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

const getErrorMessage = (err: unknown): string => {
  if (err && typeof err === 'object' && 'data' in err) {
    const data = (err as { data?: { title?: string } }).data
    if (data?.title) return data.title
  }
  return 'Something went wrong. Please try again.'
}

interface CreateCustomerFormProps {
  onClose: () => void
}

export const CreateCustomerForm = ({ onClose }: CreateCustomerFormProps) => {
  const [createCustomer, { isLoading }] = useCreateCustomerMutation()
  const navigate = useNavigate()

  const [type, setType] = useState<CustomerType>()
  const [source, setSource] = useState<CustomerSource>()
  const [error, setError] = useState<string>()

  const onSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault()
    setError(undefined)

    const data = Object.fromEntries(new FormData(e.currentTarget)) as {
      name: string
      email: string
      phoneNumber: string
      phoneExtension: string
    }

    if (!type || !source) {
      setError('Please choose a type and a source.')
      return
    }

    const phoneNumber = data.phoneNumber.trim()
    const email = data.email.trim()
    if (!email && !phoneNumber) {
      setError('Provide an email or a phone number.')
      return
    }

    try {
      const created = await createCustomer({
        name: data.name.trim(),
        type,
        source,
        email: email || undefined,
        phone: phoneNumber
          ? { number: phoneNumber, extension: data.phoneExtension.trim() || null }
          : undefined,
      }).unwrap()
      onClose()
      navigate(`/customers/${created.id}`)
      toast.success(`${created.name} was created.`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      {error && <Message variant="error">{error}</Message>}

      <TextField name="name" label="Name" placeholder="Acme Corp" autoFocus isRequired />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Type"
          items={typeOptions}
          placeholder="Choose a type"
          selectedKey={type ?? null}
          onSelectionChange={(key) => setType(key as CustomerType)}
        />
        <Select
          label="Source"
          items={sourceOptions}
          placeholder="Choose a source"
          selectedKey={source ?? null}
          onSelectionChange={(key) => setSource(key as CustomerSource)}
        />
      </div>

      <TextField
        name="email"
        label="Email"
        type="email"
        placeholder="hello@acme.com"
      />

      <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-4">
        <div className="min-w-0">
          <TextField name="phoneNumber" label="Phone" type="tel" placeholder="(555) 123-4567" />
        </div>
        <div className="min-w-0">
          <TextField name="phoneExtension" label="Ext." placeholder="123" />
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        An email or phone number is required.
      </p>

      <div className="mt-2 flex justify-end gap-2">
        <Button variant="secondary" type="button" onPress={onClose}>
          Cancel
        </Button>
        <Button type="submit" isPending={isLoading}>
          Create customer
        </Button>
      </div>
    </Form>
  )
}

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
} from '../../../components'
import { useCreateCustomerMutation } from '../../../services'
import type { CustomerSource, CustomerType } from '../../../types/customer'
import { getFormErrorMessage, sourceOptions, typeOptions } from './customerFormShared'

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
      toast.error(getFormErrorMessage(err))
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
          value={type ?? null}
          onChange={(key) => setType(key as CustomerType)}
        />
        <Select
          label="Source"
          items={sourceOptions}
          placeholder="Choose a source"
          value={source ?? null}
          onChange={(key) => setSource(key as CustomerSource)}
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

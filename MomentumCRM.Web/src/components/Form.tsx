import { Form as AriaForm, type FormProps as AriaFormProps } from 'react-aria-components'

export interface FormProps extends Omit<AriaFormProps, 'className'> {
  className?: string
}

export type FormSubmitHandler = NonNullable<AriaFormProps['onSubmit']>

export const Form = ({ className = '', ...props }: FormProps) => (
  <AriaForm {...props} className={`flex flex-col gap-4 ${className}`} />
)

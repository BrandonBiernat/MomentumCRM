import {
  TextField as AriaTextField,
  Label,
  Input,
  FieldError,
  Text,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components'

interface TextFieldProps extends AriaTextFieldProps {
  label?: string
  description?: string
  placeholder?: string
  errorMessage?: string
}

export const TextField = ({ label, description, placeholder, errorMessage, ...props }: TextFieldProps) => (
  <AriaTextField {...props} isInvalid={!!errorMessage} className="flex flex-col gap-1.5">
    {label && <Label className="text-sm font-medium text-slate-700">{label}</Label>}
    <Input
      placeholder={placeholder}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:bg-slate-50 invalid:border-red-400 invalid:focus:border-red-500 invalid:focus:ring-red-500/30"
    />
    {description && (
      <Text slot="description" className="text-xs text-slate-500">
        {description}
      </Text>
    )}
    <FieldError className="text-xs text-red-600">{errorMessage}</FieldError>
  </AriaTextField>
)

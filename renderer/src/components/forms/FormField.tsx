import React from 'react'
import { FieldProps, Field } from 'formik'
import { TextField, Text, Callout } from '@radix-ui/themes'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  showPasswordToggle?: boolean
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div className="space-y-2">
          <label>
            <Text as="div" size="2" mb="1">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Text>
            <TextField.Root
              {...field}
              type={showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type}
              placeholder={placeholder}
              size="3"
              required={required}
              disabled={disabled}
              autoComplete={autoComplete}
              color={meta.touched && meta.error ? 'red' : undefined}
            >
              {showPasswordToggle && type === 'password' && (
                <TextField.Slot side="right">
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </TextField.Slot>
              )}
            </TextField.Root>
          </label>
          
          {meta.touched && meta.error && (
            <Callout.Root color="red" role="alert">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>{meta.error}</Callout.Text>
            </Callout.Root>
          )}
        </div>
      )}
    </Field>
  )
}

import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Flex, Link as RadixLink, Strong, Text } from '@radix-ui/themes'
import { FormContainer } from '../forms/FormContainer'
import { FormField } from '../forms/FormField'
import { FormButton } from '../forms/FormButton'
import { useResetPassword } from '../../hooks/useAuth'

interface ForgotPasswordFormValues {
  email: string
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
})

interface ForgotPasswordFormProps {
  onBackToLogin: () => void
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBackToLogin,
}) => {
  const resetPasswordMutation = useResetPassword()
  const [emailSent, setEmailSent] = React.useState(false)

  const initialValues: ForgotPasswordFormValues = {
    email: '',
  }

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await resetPasswordMutation.mutateAsync(values.email)
      setEmailSent(true)
    } catch (error) {
      // Error is handled by the mutation
      console.error('Reset password failed:', error)
    }
  }

  if (emailSent) {
    return (
      <FormContainer
        title="Check your email"
        subtitle="We've sent you a password reset link."
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">📧</span>
          </div>
          <Text size="3">
            We've sent a password reset link to your email address. Please check
            your inbox and follow the instructions to reset your password.
          </Text>
          <Text size="2" color="gray">
            Didn't receive the email? Check your spam folder or try again.
          </Text>
          <Flex direction="column" gap="2">
            <FormButton
              type="button"
              variant="outline"
              onClick={() => setEmailSent(false)}
            >
              Try again
            </FormButton>
            <RadixLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onBackToLogin()
              }}
              size="2"
            >
              Back to sign in
            </RadixLink>
          </Flex>
        </div>
      </FormContainer>
    )
  }

  return (
    <FormContainer
      title="Reset Password"
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Flex direction="column" gap="3">
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <FormButton
              type="submit"
              size="3"
              highContrast
              loading={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending}
            >
              Send Reset Link
            </FormButton>
          </Flex>
        </Form>
      </Formik>

      <Text size="2" align="center">
        Remember your password?{' '}
        <RadixLink
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onBackToLogin()
          }}
        >
          <Strong>Sign in</Strong>
        </RadixLink>
      </Text>
    </FormContainer>
  )
}

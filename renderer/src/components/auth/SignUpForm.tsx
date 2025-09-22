import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Flex, Link as RadixLink, Strong, Text } from '@radix-ui/themes'
import { FormContainer } from '../forms/FormContainer'
import { FormField } from '../forms/FormField'
import { FormButton } from '../forms/FormButton'
import { useSignUp } from '../../hooks/useAuth'

interface SignUpFormValues {
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
})

interface SignUpFormProps {
  onSwitchToLogin: () => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin }) => {
  const signUpMutation = useSignUp()

  const initialValues: SignUpFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  }

  const handleSubmit = async (values: SignUpFormValues) => {
    try {
      await signUpMutation.mutateAsync({
        email: values.email,
        password: values.password,
      })
    } catch (error) {
      // Error is handled by the mutation
      console.error('Sign up failed:', error)
    }
  }

  return (
    <FormContainer
      title="Create Account"
      subtitle="Get started with your new account today."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
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

              <FormField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                showPasswordToggle
              />

              <FormField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                showPasswordToggle
              />

              <Flex asChild align="center" gap="2">
                <label>
                  <input
                    type="checkbox"
                    checked={values.acceptTerms}
                    onChange={(e) => setFieldValue('acceptTerms', e.target.checked)}
                    className="rounded"
                  />
                  <Text size="2">
                    I accept the{' '}
                    <RadixLink href="#" size="2">
                      Terms and Conditions
                    </RadixLink>{' '}
                    and{' '}
                    <RadixLink href="#" size="2">
                      Privacy Policy
                    </RadixLink>
                  </Text>
                </label>
              </Flex>

              <FormButton
                type="submit"
                size="3"
                highContrast
                loading={signUpMutation.isPending}
                disabled={signUpMutation.isPending}
              >
                Create Account
              </FormButton>
            </Flex>
          </Form>
        )}
      </Formik>

      <Text size="2" align="center">
        Already have an account?{' '}
        <RadixLink
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onSwitchToLogin()
          }}
        >
          <Strong>Sign in</Strong>
        </RadixLink>
      </Text>
    </FormContainer>
  )
}

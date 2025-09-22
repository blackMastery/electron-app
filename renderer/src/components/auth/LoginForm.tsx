import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Flex, Link as RadixLink, Strong, Switch, Text } from '@radix-ui/themes'
import { FormContainer } from '../forms/FormContainer'
import { FormField } from '../forms/FormField'
import { FormButton } from '../forms/FormButton'
import { useSignIn } from '../../hooks/useAuth'

interface LoginFormValues {
  email: string
  password: string
  remember: boolean
}

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  remember: Yup.boolean(),
})

interface LoginFormProps {
  onSwitchToSignUp: () => void
  onForgotPassword: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignUp,
  onForgotPassword,
}) => {
  const signInMutation = useSignIn()

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
    remember: false,
  }

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await signInMutation.mutateAsync({
        email: values.email,
        password: values.password,
      })
    } catch (error) {
      // Error is handled by the mutation
      console.error('Login failed:', error)
    }
  }

  return (
    <FormContainer
      title="Sign in"
      subtitle="Welcome back! Please sign in to your account."
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
                autoComplete="current-password"
                showPasswordToggle
              />

              <Flex align="center" justify="between">
                <Flex asChild align="center" gap="2">
                  <label>
                    <Switch
                      checked={values.remember}
                      onCheckedChange={(checked) => setFieldValue('remember', checked)}
                    />
                    <Text size="2">Remember me</Text>
                  </label>
                </Flex>
                <RadixLink
                  href="#"
                  size="2"
                  onClick={(e) => {
                    e.preventDefault()
                    onForgotPassword()
                  }}
                >
                  Forgot password?
                </RadixLink>
              </Flex>

              <FormButton
                type="submit"
                size="3"
                highContrast
                loading={signInMutation.isPending}
                disabled={signInMutation.isPending}
              >
                Sign in
              </FormButton>
            </Flex>
          </Form>
        )}
      </Formik>

      <Text size="2" align="center">
        Don&apos;t have an account?{' '}
        <RadixLink
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onSwitchToSignUp()
          }}
        >
          <Strong>Sign up</Strong>
        </RadixLink>
      </Text>
    </FormContainer>
  )
}

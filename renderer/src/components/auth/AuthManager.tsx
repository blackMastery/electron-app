import React, { useState } from 'react'
import { useIsAuthenticated, useAuthLoading } from '../../stores/authStore'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { Dashboard } from './Dashboard'

type AuthView = 'login' | 'signup' | 'forgot-password'

export const AuthManager: React.FC = () => {
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useAuthLoading()
  const [currentView, setCurrentView] = useState<AuthView>('login')

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return <Dashboard />
  }

  // Show appropriate auth form based on current view
  switch (currentView) {
    case 'signup':
      return (
        <SignUpForm
          onSwitchToLogin={() => setCurrentView('login')}
        />
      )
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          onBackToLogin={() => setCurrentView('login')}
        />
      )
    case 'login':
    default:
      return (
        <LoginForm
          onSwitchToSignUp={() => setCurrentView('signup')}
          onForgotPassword={() => setCurrentView('forgot-password')}
        />
      )
  }
}

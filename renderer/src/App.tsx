import React from 'react'
import { AuthProvider } from './components/auth/AuthProvider'
import { AuthManager } from './components/auth/AuthManager'

export default function App() {
  return (
    <AuthProvider>
      <AuthManager />
    </AuthProvider>
  )
}



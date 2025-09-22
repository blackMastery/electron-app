# Authentication Setup Guide

This guide will help you set up the authentication system for your Electron desktop app using Supabase, Zustand, React Query, and Formik.

## Prerequisites

1. A Supabase account and project
2. Node.js installed on your system

## Setup Steps

### 1. Supabase Project Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. In your Supabase dashboard, go to **Settings** > **API**
3. Copy your project URL and anon key

### 2. Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 3. Supabase Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the following SQL to enable email authentication:

```sql
-- Enable email authentication (usually enabled by default)
-- Check Authentication > Settings > Auth Providers to ensure email is enabled

-- Optional: Create a profiles table for additional user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4. Run the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Features Implemented

### ✅ Authentication Flow
- **Login Form**: Email/password authentication with validation
- **Sign Up Form**: User registration with password confirmation
- **Forgot Password**: Password reset via email
- **Dashboard**: Protected user dashboard
- **Logout**: Secure session termination

### ✅ Form Components
- **FormField**: Reusable form input with validation
- **FormButton**: Loading states and disabled states
- **FormContainer**: Consistent form layout
- **Formik Integration**: Form validation and state management

### ✅ State Management
- **Zustand Store**: Persistent auth state
- **React Query**: Server state management and caching
- **TypeScript**: Full type safety

### ✅ UI/UX Features
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Password Visibility Toggle**: Better UX for password fields
- **Remember Me**: Optional session persistence

## Architecture

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx      # Auth context and session management
│   │   ├── AuthManager.tsx       # Route between auth forms
│   │   ├── LoginForm.tsx         # Login form with validation
│   │   ├── SignUpForm.tsx        # Registration form
│   │   ├── ForgotPasswordForm.tsx # Password reset form
│   │   └── Dashboard.tsx         # Protected user dashboard
│   └── forms/
│       ├── FormField.tsx         # Reusable form input
│       ├── FormButton.tsx        # Reusable button with loading
│       └── FormContainer.tsx     # Form layout wrapper
├── hooks/
│   └── useAuth.ts               # React Query auth hooks
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   └── queryClient.ts           # React Query configuration
├── stores/
│   └── authStore.ts             # Zustand auth state store
└── App.tsx                      # Main app component
```

## Usage Examples

### Using Auth Hooks

```typescript
import { useSignIn, useSignOut, useUser } from './hooks/useAuth'

function MyComponent() {
  const signInMutation = useSignIn()
  const signOutMutation = useSignOut()
  const { data: user } = useUser()

  const handleLogin = async () => {
    await signInMutation.mutateAsync({
      email: 'user@example.com',
      password: 'password123'
    })
  }

  return (
    <div>
      {user ? (
        <button onClick={() => signOutMutation.mutate()}>
          Sign Out
        </button>
      ) : (
        <button onClick={handleLogin}>
          Sign In
        </button>
      )}
    </div>
  )
}
```

### Using Auth Store

```typescript
import { useAuthUser, useIsAuthenticated } from './stores/authStore'

function ProtectedComponent() {
  const user = useAuthUser()
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    return <div>Please sign in</div>
  }

  return <div>Welcome, {user?.email}!</div>
}
```

### Creating Custom Forms

```typescript
import { Formik, Form } from 'formik'
import { FormField, FormButton, FormContainer } from './components/forms'

function CustomForm() {
  return (
    <FormContainer title="Custom Form">
      <Formik
        initialValues={{ name: '', email: '' }}
        onSubmit={(values) => console.log(values)}
      >
        <Form>
          <FormField name="name" label="Name" required />
          <FormField name="email" label="Email" type="email" required />
          <FormButton type="submit">Submit</FormButton>
        </Form>
      </Formik>
    </FormContainer>
  )
}
```

## Security Features

- **Context Isolation**: Electron security best practices
- **No Node Integration**: Renderer process is sandboxed
- **Secure Storage**: Auth tokens stored securely
- **Row Level Security**: Database-level security policies
- **Input Validation**: Client and server-side validation
- **CSRF Protection**: Built into Supabase auth

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure your `.env` file exists and contains the correct variables
   - Restart your development server after adding environment variables

2. **"Invalid email or password"**
   - Check that the user exists in your Supabase dashboard
   - Verify email confirmation is not required (or user has confirmed email)

3. **"Network error"**
   - Check your internet connection
   - Verify your Supabase URL is correct
   - Ensure your Supabase project is not paused

4. **Forms not submitting**
   - Check browser console for validation errors
   - Ensure all required fields are filled
   - Verify password meets requirements (8+ chars, uppercase, lowercase, number)

### Development Tips

- Use browser dev tools to inspect network requests
- Check Supabase dashboard for auth logs
- Use React Query DevTools for debugging queries
- Monitor Zustand store state in Redux DevTools

## Next Steps

Consider implementing:
- Email verification flow
- Social authentication (Google, GitHub, etc.)
- Two-factor authentication
- User profile management
- Role-based access control
- Real-time features with Supabase subscriptions

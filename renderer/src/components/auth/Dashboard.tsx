import React from 'react'
import { Card, Flex, Heading, Text, Button } from '@radix-ui/themes'
import { useAuthUser } from '../../stores/authStore'
import { useSignOut } from '../../hooks/useAuth'

export const Dashboard: React.FC = () => {
  const user = useAuthUser()
  const signOutMutation = useSignOut()

  const handleSignOut = async () => {
    try {
      await signOutMutation.mutateAsync()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  return (
    <Flex align="center" justify="center" style={{ minBlockSize: '100dvh' }} px="5">
      <Card size="3" style={{ inlineSize: '100%', maxInlineSize: 600 }}>
        <Flex direction="column" gap="4">
          <div className="text-center">
            <Heading size="6" align="center">
              Welcome to your Dashboard!
            </Heading>
            <Text size="3" color="gray" className="mt-2">
              You are successfully signed in
            </Text>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Text size="2" weight="medium" className="mb-2">
              Account Information:
            </Text>
            <Text size="2" className="block">
              <strong>Email:</strong> {user?.email}
            </Text>
            <Text size="2" className="block">
              <strong>User ID:</strong> {user?.id}
            </Text>
            <Text size="2" className="block">
              <strong>Created:</strong>{' '}
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </Text>
          </div>

          <div className="space-y-3">
            <Button
              size="3"
              variant="outline"
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
              className="w-full"
            >
              {signOutMutation.isPending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </Flex>
      </Card>
    </Flex>
  )
}

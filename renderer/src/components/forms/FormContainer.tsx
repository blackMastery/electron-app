import React from 'react'
import { Card, Flex, Heading, Separator, Text } from '@radix-ui/themes'

interface FormContainerProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: string
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  children,
  footer,
  maxWidth = '440px',
}) => {
  return (
    <Flex align="center" justify="center" style={{ minBlockSize: '100dvh' }} px="5">
      <Card size="3" style={{ inlineSize: '100%', maxInlineSize: maxWidth }}>
        <Flex direction="column" gap="4">
          <div className="text-center">
            <Heading size="6" align="center">
              {title}
            </Heading>
            {subtitle && (
              <Text size="2" color="gray" className="mt-2">
                {subtitle}
              </Text>
            )}
          </div>

          {children}

          {footer && (
            <>
              <Separator my="1" size="4" />
              {footer}
            </>
          )}
        </Flex>
      </Card>
    </Flex>
  )
}

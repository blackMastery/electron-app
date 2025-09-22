import React from 'react'
import { Button } from '@radix-ui/themes'

interface FormButtonProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'solid' | 'soft' | 'outline' | 'ghost'
  color?: 'gray' | 'gold' | 'bronze' | 'brown' | 'yellow' | 'amber' | 'orange' | 'tomato' | 'red' | 'ruby' | 'crimson' | 'pink' | 'plum' | 'purple' | 'violet' | 'iris' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'jade' | 'green' | 'grass' | 'lime' | 'mint' | 'sky'
  size?: '1' | '2' | '3' | '4'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const FormButton: React.FC<FormButtonProps> = ({
  type = 'submit',
  variant = 'solid',
  color = 'blue',
  size = '3',
  disabled = false,
  loading = false,
  children,
  className = '',
  onClick,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      className={`${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={onClick}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import './toast.scss'

type ToastProps = Readonly<{
  isOpened: boolean
  autoDuration?: number
  swipeDirection?: 'right' | 'left' | 'up' | 'down'
  title?: string
  description?: string
  onOpenChange?: (isOpened: boolean) => void
}>

export const Toast: React.FC<ToastProps> = ({
  isOpened = false,
  autoDuration = 3000,
  swipeDirection = 'left',
  title,
  description,
  onOpenChange
}: ToastProps) => {
  return (
    <ToastPrimitive.Provider duration={autoDuration} swipeDirection={swipeDirection}>
      <ToastPrimitive.Root className="okp4-toast-root" onOpenChange={onOpenChange} open={isOpened}>
        <ToastPrimitive.Title>{title}</ToastPrimitive.Title>
        <ToastPrimitive.Description>{description}</ToastPrimitive.Description>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="okp4-toast-viewport" />
    </ToastPrimitive.Provider>
  )
}

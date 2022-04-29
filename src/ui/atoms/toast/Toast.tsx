import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import './toast.scss'
import { Typography } from 'ui/atoms/typography/Typography'

type ToastProps = Readonly<{
  isOpened: boolean
  severityLevel: 'error' | 'success' | 'info' | 'warning'
  autoDuration?: number
  title?: string
  description?: string
  onOpenChange?: (isOpened: boolean) => void
}>

export const Toast: React.FC<ToastProps> = ({
  isOpened = false,
  autoDuration = 3000,
  severityLevel,
  title,
  description,
  onOpenChange
}: ToastProps) => {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        className={`okp4-toast-root ${severityLevel}`}
        defaultOpen={false}
        duration={autoDuration}
        onOpenChange={onOpenChange}
        open={isOpened}
      >
        {title && (
          <ToastPrimitive.Title asChild className="okp4-toast-title">
            <Typography
              as="span"
              color="highlighted-text"
              fontSize="small"
              fontWeight="bold"
              noWrap
            >
              {title}
            </Typography>
          </ToastPrimitive.Title>
        )}
        {description && (
          <ToastPrimitive.Description className="okp4-toast-description">
            <Typography as="span" color="highlighted-text" fontSize="small" fontWeight="light">
              {description}
            </Typography>
          </ToastPrimitive.Description>
        )}
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="okp4-toast-viewport" />
    </ToastPrimitive.Provider>
  )
}

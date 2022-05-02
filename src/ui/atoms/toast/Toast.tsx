import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import './toast.scss'
import { Typography } from 'ui/atoms/typography/Typography'

type ToastProps = Readonly<{
  /**
   * Indicates if the toast must be displayed or not
   */
  readonly isOpened: boolean
  /**
   * The severity level of the carried information, influences the final rendering of the toast
   */
  readonly severityLevel: 'error' | 'success' | 'info' | 'warning'
  /**
   * The time in milliseconds that should elapse before automatically closing the toast.
   */
  readonly autoDuration?: number
  /**
   * An optional title for the toast.
   */
  readonly title?: string
  /**
   * An optional description for the toast.
   */
  readonly description?: string
  /**
   * Event handler called when the open state of the dialog changes.
   */
  readonly onOpenChange?: (isOpened: boolean) => void
}>

export const Toast: React.FC<ToastProps> = ({
  isOpened,
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

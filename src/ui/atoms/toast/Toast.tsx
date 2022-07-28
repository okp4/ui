import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { Typography } from 'ui/atoms/typography/Typography'
import './toast.scss'
import type { DeepReadonly } from 'superTypes'
import { isString } from 'utils'
import { Icon } from 'ui/atoms/icon/Icon'

type ToastProps = Readonly<{
  /**
   * Indicates if the toast must be displayed or not.
   */
  readonly isOpened: boolean
  /**
   * The severity level of the carried information, influences the final rendering of the toast.
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
  readonly description?: string | JSX.Element
  /**
   * Event handler called when the open state of the dialog changes.
   */
  readonly onOpenChange?: (isOpened: boolean) => void
  /**
   * Prevents the toast from closing automatically.
   */
  readonly preventAutoClose?: boolean
}>

// eslint-disable-next-line max-lines-per-function
export const Toast: React.FC<ToastProps> = ({
  isOpened = false,
  autoDuration = 3000,
  severityLevel,
  title,
  description,
  onOpenChange,
  preventAutoClose = false
}: DeepReadonly<ToastProps>) => {
  const closeButton = (
    <ToastPrimitive.Close className="okp4-toast-close">
      <div className="okp4-toast-container-close">
        <Icon name="close" size={20} />
      </div>
    </ToastPrimitive.Close>
  )
  const closeButtonMask = <div className="okp4-toast-float"></div>

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        className={`okp4-toast-root ${severityLevel}`}
        defaultOpen={false}
        duration={preventAutoClose ? Infinity : autoDuration}
        onOpenChange={onOpenChange}
        open={isOpened}
      >
        {preventAutoClose && closeButton}
        {title && (
          <ToastPrimitive.Title asChild>
            <Typography
              as="span"
              color="highlighted-text"
              fontSize="small"
              fontWeight="bold"
              noWrap
            >
              {preventAutoClose && closeButtonMask}
              {title}
            </Typography>
          </ToastPrimitive.Title>
        )}
        {description && (
          <ToastPrimitive.Description asChild>
            {isString(description) ? (
              <Typography as="span" color="highlighted-text" fontSize="small" fontWeight="light">
                {preventAutoClose && !title && closeButtonMask}
                {description}
              </Typography>
            ) : (
              description
            )}
          </ToastPrimitive.Description>
        )}
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="okp4-toast-viewport" />
    </ToastPrimitive.Provider>
  )
}

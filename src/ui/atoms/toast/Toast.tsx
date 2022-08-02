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
  isOpened,
  autoDuration = 3000,
  severityLevel,
  title,
  description,
  onOpenChange,
  preventAutoClose
}: DeepReadonly<ToastProps>) => {
  const closeButton = (
    <ToastPrimitive.Close className="okp4-toast-close">
      <Icon name="close" size={20} />
    </ToastPrimitive.Close>
  )

  const renderTitle = (): string | JSX.Element | undefined =>
    title && (
      <ToastPrimitive.Title asChild>
        <Typography color="highlighted-text" fontSize="small" fontWeight="bold">
          {title}
        </Typography>
      </ToastPrimitive.Title>
    )

  const renderDescription = (): string | JSX.Element | undefined =>
    description && (
      <ToastPrimitive.Description asChild>
        {isString(description) ? (
          <Typography color="highlighted-text" fontSize="small" fontWeight="light">
            {description}
          </Typography>
        ) : (
          description
        )}
      </ToastPrimitive.Description>
    )

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        className={`okp4-toast-root ${severityLevel}`}
        defaultOpen={false}
        duration={preventAutoClose ? Infinity : autoDuration}
        onOpenChange={onOpenChange}
        open={isOpened}
      >
        {title && preventAutoClose ? (
          <div className="okp4-toast-wrapper">
            {renderTitle()}
            {closeButton}
          </div>
        ) : (
          renderTitle()
        )}

        {description && preventAutoClose ? (
          title ? (
            renderDescription()
          ) : (
            <div className="okp4-toast-wrapper">
              {renderDescription()}
              {closeButton}
            </div>
          )
        ) : (
          renderDescription()
        )}
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="okp4-toast-viewport" />
    </ToastPrimitive.Provider>
  )
}

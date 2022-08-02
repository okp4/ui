import React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { Typography } from 'ui/atoms/typography/Typography'
import './toast.scss'
import type { DeepReadonly } from 'superTypes'
import { isString } from 'utils'
import { Icon } from 'ui/atoms/icon/Icon'

type ToastProps = {
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
}

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
  const CloseButton: React.FC = () => (
    <ToastPrimitive.Close className="okp4-toast-close">
      <Icon name="close" size={20} />
    </ToastPrimitive.Close>
  )

  const Title: React.FC = () => {
    const ToastTitle: React.FC = () => (
      <ToastPrimitive.Title asChild>
        <Typography color="highlighted-text" fontSize="small" fontWeight="bold">
          {title}
        </Typography>
      </ToastPrimitive.Title>
    )

    const TitleWithCloseButton: React.FC = () => (
      <div className="okp4-toast-wrapper">
        <ToastTitle />
        <CloseButton />
      </div>
    )

    return title ? preventAutoClose ? <TitleWithCloseButton /> : <ToastTitle /> : null
  }

  const Description: React.FC = () => {
    const descriptionWithCloseButton = description && preventAutoClose && !title

    const ToastDescription: React.FC = () => (
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

    const DescriptionWithCloseButton: React.FC = () => (
      <div className="okp4-toast-wrapper">
        <ToastDescription />
        <CloseButton />
      </div>
    )

    return description ? (
      descriptionWithCloseButton ? (
        <DescriptionWithCloseButton />
      ) : (
        <ToastDescription />
      )
    ) : null
  }

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        className={`okp4-toast-root ${severityLevel}`}
        defaultOpen={false}
        duration={preventAutoClose ? Infinity : autoDuration}
        onOpenChange={onOpenChange}
        open={isOpened}
      >
        <Title />
        <Description />
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="okp4-toast-viewport" />
    </ToastPrimitive.Provider>
  )
}

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

type TitleProps = Pick<ToastProps, 'title' | 'preventAutoClose'>
type DescriptionProps = TitleProps & Pick<ToastProps, 'description'>

const closeButton = (
  <ToastPrimitive.Close className="okp4-toast-close">
    <Icon name="close" size={20} />
  </ToastPrimitive.Close>
)

const Title: React.FC<TitleProps> = ({ preventAutoClose, title }: DeepReadonly<TitleProps>) => {
  if (!title) return null

  const titleTypography = (
    <ToastPrimitive.Title asChild>
      <Typography color="invariant-text" fontSize="small" fontWeight="bold">
        {title}
      </Typography>
    </ToastPrimitive.Title>
  )

  const titleWithCloseButton = (
    <div className="okp4-toast-wrapper">
      {titleTypography}
      {closeButton}
    </div>
  )

  return preventAutoClose ? titleWithCloseButton : titleTypography
}

const Description: React.FC<DescriptionProps> = ({
  description,
  preventAutoClose,
  title
}: DeepReadonly<DescriptionProps>) => {
  if (!description) return null

  const toastDescription = (
    <ToastPrimitive.Description asChild>
      {isString(description) ? (
        <Typography color="invariant-text" fontSize="small" fontWeight="light">
          {description}
        </Typography>
      ) : (
        description
      )}
    </ToastPrimitive.Description>
  )

  const descriptionWithCloseButton = (
    <div className="okp4-toast-wrapper">
      {toastDescription}
      {closeButton}
    </div>
  )

  const hasCloseButton = preventAutoClose && !title

  return hasCloseButton ? descriptionWithCloseButton : toastDescription
}

export const Toast: React.FC<ToastProps> = ({
  isOpened,
  autoDuration = 3000,
  severityLevel,
  onOpenChange,
  preventAutoClose,
  title,
  description
}: DeepReadonly<ToastProps>) => {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        className={`okp4-toast-root ${severityLevel}`}
        defaultOpen={false}
        duration={preventAutoClose ? Infinity : autoDuration}
        onOpenChange={onOpenChange}
        open={isOpened}
      >
        <Title preventAutoClose={preventAutoClose} title={title} />
        <Description description={description} preventAutoClose={preventAutoClose} title={title} />
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="okp4-toast-viewport" />
    </ToastPrimitive.Provider>
  )
}

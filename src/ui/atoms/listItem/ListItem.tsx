import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './listItem.scss'
import { isString } from 'utils'
import classNames from 'classnames'

export type ListItemProps = {
  /**
   * The main title of the item.
   */
  readonly title?: string
  /**
   * Additional information about the item
   */
  readonly description?: string | JSX.Element
  /**
   * An element that can provide visual information or allow interactions on the left side.
   */
  readonly firstElement?: JSX.Element
  /**
   * An element that can provide visual information or allow interactions on the right side.
   */
  readonly lastElement?: JSX.Element
  /**
   * The callback function called when the list item is clicked.
   * The `onClick` function is an event handler attached to the list item.
   */
  readonly onClick?: () => void
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  firstElement,
  lastElement,
  onClick
}: DeepReadonly<ListItemProps>): JSX.Element => {
  const renderDescription = (): string | JSX.Element | undefined =>
    description && (
      <div className="okp4-listitem-description">
        {isString(description) ? (
          <Typography as="div" color="inverted-text" fontSize="small">
            {description}
          </Typography>
        ) : (
          description
        )}
      </div>
    )

  return (
    <div className={classNames('okp4-listitem-main', { clickable: !!onClick })} onClick={onClick}>
      {firstElement && <div className="okp4-listitem-first-element">{firstElement}</div>}
      {title && (
        <div className="okp4-listitem-title">
          <Typography as="div" color="inverted-text" fontSize="small" fontWeight="bold">
            {title}
          </Typography>
        </div>
      )}
      {renderDescription()}
      {lastElement && <div className="okp4-listitem-last-element">{lastElement}</div>}
    </div>
  )
}

import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './listItem.scss'
import { isString } from 'utils'

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
  readonly leftElement?: JSX.Element
  /**
   * An element that can provide visual information or allow interactions on the right side.
   */
  readonly rightElement?: JSX.Element
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  leftElement,
  rightElement
}: DeepReadonly<ListItemProps>): JSX.Element => {
  const renderDescription = (): string | JSX.Element | undefined =>
    description && (
      <div className="okp4-listitem-description">
        {isString(description) ? (
          <Typography as="div" color="text" fontSize="small">
            {description}
          </Typography>
        ) : (
          description
        )}
      </div>
    )

  return (
    <div className="okp4-listitem-main">
      {leftElement && <div className="okp4-listitem-left-element">{leftElement}</div>}
      {title && (
        <div className="okp4-listitem-title">
          <Typography as="div" color="text" fontSize="small" fontWeight="bold">
            {title}
          </Typography>
        </div>
      )}
      {renderDescription()}
      {rightElement && <div className="okp4-listitem-right-element">{rightElement}</div>}
    </div>
  )
}

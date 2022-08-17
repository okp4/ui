import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './listItem.scss'
import { isString } from 'utils'

export type ListItemProps = {
  /**
   * The main label of the item.
   */
  readonly label: string
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
  label,
  description,
  leftElement,
  rightElement
}: DeepReadonly<ListItemProps>): JSX.Element => {
  const renderDescription = (): string | JSX.Element | undefined =>
    isString(description) ? (
      <Typography as="div" color="text" fontSize="small">
        {description}
      </Typography>
    ) : (
      description
    )

  return (
    <div className="okp4-listitem-main">
      {leftElement && <div className="okp4-listitem-left-element">{leftElement}</div>}
      <div className="okp4-listitem-label">
        <Typography as="div" color="text" fontSize="small" fontWeight="bold">
          {label}
        </Typography>
      </div>
      {description && <div className="okp4-listitem-description">{renderDescription()}</div>}
      {rightElement && <div className="okp4-listitem-right-element">{rightElement}</div>}
    </div>
  )
}

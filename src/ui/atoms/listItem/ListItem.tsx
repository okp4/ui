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
   * An icon that can provide visual information in the left side.
   */
  readonly leftIcon?: JSX.Element
  /**
   * An icon that can provide visual information in the right side.
   */
  readonly rightIcon?: JSX.Element
}

export const ListItem: React.FC<ListItemProps> = ({
  label,
  description,
  leftIcon,
  rightIcon
}: DeepReadonly<ListItemProps>): JSX.Element => {
  return (
    <div className="okp4-listitem-main">
      {leftIcon && <div className="okp4-listitem-icon-left">{leftIcon}</div>}
      <div className="okp4-listitem-label">
        <Typography as="div" color="text" fontSize="small" fontWeight="bold">
          {label}
        </Typography>
      </div>
      {description && (
        <div className="okp4-listitem-description">
          {isString(description) ? (
            <Typography as="div" color="text" fontSize="small">
              {description}
            </Typography>
          ) : (
            description
          )}
        </div>
      )}
      {rightIcon && <div className="okp4-listitem-icon-right">{rightIcon}</div>}
    </div>
  )
}

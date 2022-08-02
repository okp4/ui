import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './listItem.scss'
import { isString } from 'utils'

export type ListItemProps = {
  /**
   * The main title of the item.
   */
  readonly name: string

  /**
   * Additionnal informations about the item
   */
  readonly description?: string | JSX.Element

  /**
   * An icon that can provide visual information in the left side.
   */
  readonly leftIcon?: Readonly<JSX.Element>

  /**
   * An icon that can provide visual information in the right side.
   */
  readonly rightIcon?: Readonly<JSX.Element>
}

/**
 * Primary UI component for an item in a list.
 */
export const ListItem: React.FC<ListItemProps> = ({
  name,
  description,
  leftIcon,
  rightIcon
}: DeepReadonly<ListItemProps>): JSX.Element => {
  return (
    <div className="okp4-listitem-main">
      <div className="okp4-listitem-name">
        <Typography as="div" color="text" fontSize="small" fontWeight="bold">
          {name}
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
      {leftIcon && <div className="okp4-listitem-icon okp4-listitem-icon--left">{leftIcon}</div>}
      {rightIcon && <div className="okp4-listitem-icon okp4-listitem-icon--right">{rightIcon}</div>}
    </div>
  )
}

import React from 'react'
import type { DeepReadonly } from 'superTypes'
import './list.scss'
import type { ListItemProps } from '../listItem/ListItem'
import { ListItem } from '../listItem/ListItem'

export type ListProps = {
  /**
   * The items of the list.
   */
  readonly items: ListItemProps[]
  /**
   * An icon displayed on the left side of each items.
   */
  readonly leftIcon?: JSX.Element
  /**
   * An icon displayed on the right side of each items.
   */
  readonly rightIcon?: JSX.Element
}

/**
 * Primary UI component for display a list of items.
 */
export const List: React.FC<ListProps> = ({
  items,
  leftIcon,
  rightIcon
}: DeepReadonly<ListProps>): JSX.Element => {
  return (
    <div className="okp4-list-main">
      {items.map((item: DeepReadonly<ListItemProps>, index: number) => (
        <ListItem
          description={item.description}
          key={index}
          label={item.label}
          leftIcon={item.leftIcon ?? leftIcon}
          rightIcon={item.rightIcon ?? rightIcon}
        />
      ))}
    </div>
  )
}

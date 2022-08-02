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
  readonly leftIcon?: Readonly<JSX.Element>
  /**
   * An icon displayed on the right side of each items.
   */
  readonly rightIcon?: Readonly<JSX.Element>
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
      {items.map((item: DeepReadonly<ListItemProps>) => (
        <ListItem
          description={item.description}
          key={item.name}
          leftIcon={item.leftIcon ?? leftIcon}
          name={item.name}
          rightIcon={item.rightIcon ?? rightIcon}
        />
      ))}
    </div>
  )
}

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
  readonly leftElement?: JSX.Element
  /**
   * An icon displayed on the right side of each items.
   */
  readonly rightElement?: JSX.Element
}

/**
 * Primary UI component for display a list of items.
 */
export const List: React.FC<ListProps> = ({
  items,
  leftElement,
  rightElement
}: DeepReadonly<ListProps>): JSX.Element => {
  return (
    <div className="okp4-list-main">
      {items.map((item: DeepReadonly<ListItemProps>, index: number) => (
        <ListItem
          description={item.description}
          key={index}
          label={item.label}
          leftElement={item.leftElement ?? leftElement}
          rightElement={item.rightElement ?? rightElement}
        />
      ))}
    </div>
  )
}

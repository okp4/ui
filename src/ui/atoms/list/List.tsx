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
}

/**
 * Primary UI component for display a list of items.
 */
export const List: React.FC<ListProps> = ({ items }: DeepReadonly<ListProps>): JSX.Element => {
  return (
    <div className="okp4-list-main">
      {items.map((item: DeepReadonly<ListItemProps>, index: number) => (
        <ListItem
          description={item.description}
          key={index}
          label={item.label}
          leftElement={item.leftElement}
          rightElement={item.rightElement}
        />
      ))}
    </div>
  )
}

import React from 'react'
import type { DeepReadonly } from 'superTypes'
import './list.scss'

export type ListProps = {
  /**
   * The elements passed as children of the List component.
   * The expected children are ListItem components.
   */
  readonly children: React.ReactElement[]
  /**
   * The layout of List. Is also passed to children as props.
   */
  readonly layout?: 'grid' | 'list'
}

export const List: React.FC<ListProps> = ({
  children,
  layout = 'list'
}: DeepReadonly<ListProps>): JSX.Element => {
  const clonedChildren = React.Children.map(children, (child: DeepReadonly<React.ReactElement>) => {
    const newProps: Pick<ListProps, 'layout'> = {
      layout
    }
    return React.isValidElement(child) ? React.cloneElement(child, newProps) : child
  })
  return <div className={`okp4-list-main layout-${layout}`}>{clonedChildren}</div>
}

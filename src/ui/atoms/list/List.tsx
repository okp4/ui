import classNames from 'classnames'
import React from 'react'
import type { DeepReadonly } from 'superTypes'
import './list.scss'

export type ListProps = {
  /**
   * The elements passed as children of the List component.
   * The expected children are ListItem components.
   */
  readonly children: React.ReactNode
  /**
   * The layout of List. Is also passed to children as props.
   */
  readonly layout?: 'grid' | 'list'
}

export const List: React.FC<ListProps> = ({
  children,
  layout = 'list'
}: DeepReadonly<ListProps>): JSX.Element => (
  <div className={classNames('okp4-list-main', `layout-${layout}`)}>{children}</div>
)

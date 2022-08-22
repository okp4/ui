import React from 'react'
import type { DeepReadonly } from 'superTypes'
import './list.scss'

export type ListProps = {
  /**
   * The elements passed as children of the List component.
   * The expected children are `ListItem` components.
   */
  readonly children: React.ReactNode
}

/**
 * Primary UI component for display a list of items.
 */
export const List: React.FC<ListProps> = ({ children }: DeepReadonly<ListProps>): JSX.Element => (
  <div className="okp4-list-main">{children}</div>
)

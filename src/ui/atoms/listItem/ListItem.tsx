import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './listItem.scss'
import { isString } from 'utils'
import classNames from 'classnames'
import type { ListProps } from '../list/List'

export type ListItemProps = Pick<ListProps, 'layout'> & {
  /**
   * The main title of the item.
   */
  readonly title?: string | JSX.Element
  /**
   * Additional information about the item
   */
  readonly description?: string | JSX.Element
  /**
   * An element that can provide visual information or allow interactions.
   * If layout is in list mode, it will be displayed on the left side.
   * If layout is in grid mode, it will be displayed on the top right corner.
   */
  readonly firstElement?: JSX.Element
  /**
   * An element that can provide visual information or allow interactions.
   * If layout is in list mode, it will be displayed on the right side.
   * If layout is in grid mode, it will be displayed at the bottom.
   */
  readonly lastElement?: JSX.Element
  /**
   * The callback function called when the list item is clicked.
   * The `onClick` function is an event handler attached to the list item.
   */
  readonly onClick?: () => void
}

type TitleProps = Pick<ListItemProps, 'title'>
type DescriptionProps = Pick<ListItemProps, 'description'>

const Title: React.FC<TitleProps> = ({ title }: DeepReadonly<TitleProps>) => {
  if (!title) return null

  const titleTypography = (
    <div className="okp4-listitem-title">
      <Typography color="inverted-text" fontSize="small" fontWeight="bold">
        {title}
      </Typography>
    </div>
  )

  return isString(title) ? titleTypography : <div className="okp4-listitem-title">{title}</div>
}

const Description: React.FC<DescriptionProps> = ({
  description
}: DeepReadonly<DescriptionProps>) => {
  if (!description) return null

  const descriptionTypography = (
    <div className="okp4-listitem-description">
      <Typography color="inverted-text" fontSize="small">
        {description}
      </Typography>
    </div>
  )

  return isString(description) ? (
    descriptionTypography
  ) : (
    <div className="okp4-listitem-description">{description}</div>
  )
}
export const ListItem: React.FC<ListItemProps> = ({
  title,
  description,
  firstElement,
  lastElement,
  onClick,
  layout
}: DeepReadonly<ListItemProps>): JSX.Element => {
  const className = classNames('okp4-listitem-main', {
    'layout-list': layout === 'list',
    'layout-grid': layout === 'grid',
    clickable: !!onClick
  })
  return (
    <div className={className} onClick={onClick}>
      {firstElement && <div className="okp4-listitem-first-element">{firstElement}</div>}
      <Title title={title} />
      <Description description={description} />
      {lastElement && <div className="okp4-listitem-last-element">{lastElement}</div>}
    </div>
  )
}

import React from 'react'
import type { DeepReadonly } from 'superTypes'
import { Typography } from '../typography/Typography'
import './listItem.scss'
import { isString } from 'utils'
import classNames from 'classnames'

export type ListItemProps = {
  /**
   * The main title of the item.
   */
  readonly title?: string | JSX.Element
  /**
   * Additional information about the item
   */
  readonly description?: string | JSX.Element
  /**
   * An element that allow for further customization in the beginning of the reading flow.
   * Is positioned to the left in a list layout and to the top right in a grid layout.
   */
  readonly firstElement?: JSX.Element
  /**
   * An element that allow for further customization in the end of the reading flow.
   * Is positioned to the right in a list layout and on the bottom in a grid layout.
   */
  readonly lastElement?: JSX.Element
  /**
   * The layout style of ListItem.
   */
  readonly layout?: 'grid' | 'list'
  /**
   * The callback function called when the list item is clicked.
   */
  readonly onClick?: () => void
}

type TitleProps = Required<Pick<ListItemProps, 'title'>>
type DescriptionProps = Required<Pick<ListItemProps, 'description'>>

const Title = ({ title }: DeepReadonly<TitleProps>): JSX.Element => (
  <div className="okp4-listitem-title">
    {isString(title) ? (
      <Typography color="inverted-text" fontSize="small" fontWeight="bold">
        {title}
      </Typography>
    ) : (
      title
    )}
  </div>
)

const Description = ({ description }: DeepReadonly<DescriptionProps>): JSX.Element => (
  <div className="okp4-listitem-description">
    {isString(description) ? (
      <Typography color="inverted-text" fontSize="small">
        {description}
      </Typography>
    ) : (
      description
    )}
  </div>
)

export const ListItem = ({
  title,
  description,
  firstElement,
  lastElement,
  onClick,
  layout = 'list'
}: DeepReadonly<ListItemProps>): JSX.Element => {
  const className = classNames(`okp4-listitem-main layout-${layout}`, {
    clickable: !!onClick,
    'with-description': !!description
  })
  return (
    <div className={className} onClick={onClick}>
      {firstElement && <div className="okp4-listitem-first-element">{firstElement}</div>}
      {title && <Title title={title} />}
      {description && <Description description={description} />}
      {lastElement && <div className="okp4-listitem-last-element">{lastElement}</div>}
    </div>
  )
}

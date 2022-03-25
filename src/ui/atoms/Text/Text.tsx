import classNames from 'classnames'
import React from 'react'
import type { DeepReadonly } from '../../../superTypes'
import './Text.scss'

export type TTextProps = DeepReadonly<{
    /**
     * Which Html element Do you want to use ? ('p' | 'span' | 'h1' ...')
     */
    readonly as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'pre' | 'ul' | 'li'
    /**
     * How large should the font size be ?
     */
    readonly size?: 'x-large' | 'large' | 'medium' | 'small' | 'x-small'
    /**
     * Font family to use ?
     */
    readonly fontFamily?: 'content' | 'brand'
    /**
     * Text alignment
     */
    readonly textAlign?: 'left' | 'center' | 'right'
    /**
     * How font weight
     */
    readonly fontWeight?: 'light' | 'medium' | 'bold' | 'black'
    /**
    * References the key of the exported variable in the color palette.
    */
    readonly colorKey?: string
    /**
     * The content of your text element. Everything in between <Text> tags
     */
    readonly children: React.ReactNode
}>

/**
 * Primary UI component for displaying text
 */
export const Text: React.FC<TTextProps> = ({
    as = 'span',
    size = 'medium',
    fontWeight = 'medium',
    fontFamily = 'content',
    textAlign = 'left',
    ...props
}: TTextProps): JSX.Element => {

    const textClass = classNames('core',
        size,
        'align-' + textAlign,
        { [`${fontFamily}-${fontWeight}`]: true, }
    )
    return React.createElement(as, { ...props, className: textClass }, props.children)
}


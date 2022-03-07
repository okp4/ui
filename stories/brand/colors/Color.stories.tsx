import React from 'react'
import { ColorKey, colorName, colorVariable } from './utils'
import colors from './_exports.module.scss'

export type StorybookColorProps = {
    /**
     * References the key of expoted the variable in the color palette.
     */
    colorKey: ColorKey
}

export const StorybookColor: React.FC<StorybookColorProps> = ({
    colorKey
}: Readonly<StorybookColorProps>) => (
    <li className="storybook color">
        <span
            className="swatch"
            style={{
                backgroundColor: colors[colorKey]
            }}
        />
        <span className="name">{colorName(colorKey)}</span>
        <var className="variable">{colorVariable(colorKey)}</var>
        <code className="code">{colors[colorKey].toLowerCase()}</code>
    </li>
)

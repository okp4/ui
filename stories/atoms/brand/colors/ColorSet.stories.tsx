import React from 'react'
import { StorybookColor } from './Color.stories'
import { ColorKey } from './utils'

import './index.scss'

export type StorybookColorSetProps = {
    /**
     * References the keys of exported the variable in the color palette.
     */
    colorKeys: Array<ColorKey>
}

export const StorybookColorSet: React.FC<StorybookColorSetProps> = ({
    colorKeys
}: Readonly<StorybookColorSetProps>) => (
    <ul className="storybook color-set">
        {colorKeys.map((colorKey: ColorKey) => {
            return <StorybookColor key={colorKey} colorKey={colorKey}/>
        })}
    </ul>
)

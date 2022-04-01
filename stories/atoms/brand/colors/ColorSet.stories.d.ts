import React from 'react';
import { ColorKey } from './utils';
import './index.scss';
export declare type StorybookColorSetProps = {
    /**
     * References the keys of exported the variable in the color palette.
     */
    colorKeys: Array<ColorKey>;
};
export declare const StorybookColorSet: React.FC<StorybookColorSetProps>;

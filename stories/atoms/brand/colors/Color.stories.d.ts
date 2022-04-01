import React from 'react';
import { ColorKey } from './utils';
export declare type StorybookColorProps = {
    /**
     * References the key of the exported variable in the color palette.
     */
    colorKey: ColorKey;
};
export declare const StorybookColor: React.FC<StorybookColorProps>;

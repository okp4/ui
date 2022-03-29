import classNames from 'classnames'
import React from 'react'
import type { IconEnum } from 'ui/styles/icons';
import { Icon } from 'ui/styles/icons'
import './textInput.scss'

export type TTextInputProps = Readonly<{
    /**
     * How large should the font size be ?
     */
    readonly size?: 'x-large' | 'large' | 'medium' | 'small' | 'x-small'

    /**
     * Placeholder text
     */
    readonly placeholder?: string
    /**
     * The font awesome icon to use without 'fa' prefix
     */
    readonly icon?: IconEnum

}>

/**
 * Primary UI component for displaying text
 */
export const TextInput: React.FC<TTextInputProps> = ({
    size = 'medium',
    placeholder = 'Placeholder',
    icon = undefined,

    // value, default value, onChange
    // if value not used non controllé 
    ...props
}: TTextInputProps): JSX.Element => {

    const divClass = classNames('okp4-textinput-wrapper')
    const iconClass = classNames('okp4-textinput-icon')
    const inputClass = classNames('okp4-textinput-core', size,)

    return <div className={divClass}>
        <input className={inputClass} placeholder={placeholder} {...props} />
        {icon && <><div>&nbsp;</div><Icon className={iconClass} iconName={icon} theme={'light'} /></>}


    </div>
}


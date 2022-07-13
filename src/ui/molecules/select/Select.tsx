import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import classNames from 'classnames'
import { Map } from 'immutable'
import type { OrderedMap } from 'immutable'
import { InputBase } from 'ui/atoms/inputBase/InputBase'
import type { InputBaseProps } from 'ui/atoms/inputBase/InputBase'
import { Typography } from 'ui/atoms/typography/Typography'
import './select.scss'

export type Option = {
  readonly label: string
  readonly value: string
  readonly group?: string
}

type OptionWithoutGroup = Omit<Option, 'group'>
type ResultMap = OrderedMap<string, OptionWithoutGroup[]>

const sortByGroupAndValues = (option1: Option, option2: Option): number => {
  const definedOption1 = option1.group ?? ''
  const definedOption2 = option2.group ?? ''

  if (definedOption1 > definedOption2) {
    return 1
  }

  if (definedOption1 < definedOption2) {
    return -1
  }

  return option1.value.localeCompare(option2.value)
}

const getOptionsSorted = (options: Readonly<Option[]>): Option[] => {
  return [...options].sort((option1: Option, option2: Option) =>
    sortByGroupAndValues(option1, option2)
  )
}

const getOptionsSortedIntoMap = (data: Readonly<Option[]>): ResultMap => {
  const sortedOptions = getOptionsSorted(data)
  return sortedOptions.reduce((acc: Readonly<ResultMap>, currentValue: Option) => {
    const { group, label, value }: Option = currentValue
    const option = { label, value }
    const groupName = group ?? 'No Group'
    const groupItems = acc.get(groupName)
    return acc.set(groupName, groupItems ? [...groupItems, option] : [option])
  }, Map())
}

export type SelectProps = InputBaseProps & {
  /**
   * The select Id
   */
  readonly id: string
  /**
   * The options list displayed when the select is opened
   */
  readonly options: Option[]
  /**
   * The size of the input field.
   * It will be automatically adjusted responsively to the screen size.
   */
  readonly size?: 'x-large' | 'large' | 'medium' | 'small' | 'x-small'
  /**
   * If true, the Select will take 100% of its parent's size
   */
  readonly fullWidth?: boolean
  /**
   * onChange callback wich allows the parent to manage the selected value(s)
   */
  readonly onChange?: (value: Readonly<string | string[]>) => void
  /**
   * Specific method to apply custom sort on the options list
   */
  readonly sortGroupsAndOptions?: (options: Readonly<Option[]>) => ResultMap
}

// eslint-disable-next-line max-lines-per-function, @typescript-eslint/prefer-readonly-parameter-types
export const Select = ({
  id,
  placeholder,
  size = 'medium',
  defaultValue,
  disabled = false,
  hasError = false,
  inputRef,
  options,
  onChange,
  sortGroupsAndOptions,
  fullWidth,
  value
}: SelectProps): JSX.Element => {
  const optionsGroupped = sortGroupsAndOptions
    ? sortGroupsAndOptions(options)
    : getOptionsSortedIntoMap(options)

  const [menuOpened, setMenuOpened]: [boolean, (isOpened: boolean) => void] =
    useState<boolean>(false)

  const selectRef: RefObject<HTMLDivElement> = useRef(null)

  const toggleMenu = useCallback(() => {
    if (!disabled) {
      setMenuOpened(!menuOpened)
    }
  }, [disabled, menuOpened])

  const handleOptionSelection = (value: string) => () => {
    if (onChange) {
      onChange(value)
    }
    toggleMenu()
  }

  const icon = menuOpened ? <ChevronUpIcon /> : <ChevronDownIcon />

  const escapeKeyHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: KeyboardEvent): void => {
      if (menuOpened && event.key === 'Escape') {
        setMenuOpened(false)
      }
    },
    [menuOpened]
  )

  const outsideMenuClickHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (event: MouseEvent): void => {
      if (menuOpened && selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setMenuOpened(false)
      }
    },
    [menuOpened]
  )

  useEffect(() => {
    document.addEventListener('keydown', escapeKeyHandler)
    return () => document.removeEventListener('keydown', escapeKeyHandler)
  }, [escapeKeyHandler])

  useEffect(() => {
    document.addEventListener('mousedown', outsideMenuClickHandler)
    return () => document.removeEventListener('mousedown', outsideMenuClickHandler)
  }, [outsideMenuClickHandler])

  return (
    <div
      className={classNames(`okp4-select-container ${size}`, {
        error: hasError,
        'full-width': fullWidth
      })}
      id={id}
      ref={selectRef}
    >
      <div className="okp4-select-input-container" onClick={toggleMenu}>
        <InputBase
          defaultValue={defaultValue}
          disabled={disabled}
          hasError={hasError}
          inputRef={inputRef}
          placeholder={placeholder}
          readOnly={true}
          rightIcon={icon}
          value={value}
        />
      </div>
      {menuOpened && (
        <div className="okp4-select-options-container">
          {/*eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types*/}
            const [group, options]: [string, OptionWithoutGroup[]] = [...entry]
            return (
              <div className="okp4-select-options-list" key={group}>
                {group && (
                  <Typography as="div" fontSize="small">
                    <p className="okp4-select-options-group">{group}</p>
                  </Typography>
                )}
                <ul>
                  {options.map(({ label, value }: OptionWithoutGroup) => (
                    <li
                      className="okp4-select-option"
                      key={value}
                      onClick={handleOptionSelection(value)}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

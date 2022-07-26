import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import classNames from 'classnames'
import { Map } from 'immutable'
import type { OrderedMap } from 'immutable'
import { compareStrings } from 'utils'
import { InputBase } from 'ui/atoms/inputBase/InputBase'
import type { InputBaseProps } from 'ui/atoms/inputBase/InputBase'
import { Typography } from 'ui/atoms/typography/Typography'
import { Icon } from 'ui/atoms/icon/Icon'
import short from 'short-uuid'
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

  return compareStrings(option1.value, option2.value)
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
   * If true, allows the user to make a multiple choice.
   * Default to false.
   */
  readonly multiple?: boolean
  /**
   * The options list displayed when the select is opened.
   */
  readonly options: Readonly<Option[]>
  /**
   * The size of the input field.
   * It will be automatically adjusted responsively to the screen size.
   */
  readonly size?: 'x-large' | 'large' | 'medium' | 'small' | 'x-small'
  /**
   * If true, the select will take 100% of its parent's size.
   */
  readonly fullWidth?: boolean
  /**
   * Displays a message to the user below the select area.
   */
  readonly helperText?: string
  /**
   * onChange callback wich allows the parent to manage the selected value(s).
   */
  readonly onValuesChange?: (value: string | Readonly<string[]>) => void
  /**
   * Specific method to apply custom sort on the options list.
   */
  readonly sortGroupsAndOptions?: (options: Readonly<Option[]>) => ResultMap
}

// eslint-disable-next-line max-lines-per-function, @typescript-eslint/prefer-readonly-parameter-types
export const Select = ({
  placeholder,
  size = 'medium',
  defaultValue,
  disabled = false,
  hasError = false,
  inputRef,
  multiple = false,
  options,
  onValuesChange,
  sortGroupsAndOptions,
  fullWidth,
  value,
  helperText,
  readOnly = false
}: SelectProps): JSX.Element => {
  const selectId = short.generate()

  const optionsGroupped = sortGroupsAndOptions
    ? sortGroupsAndOptions(options)
    : getOptionsSortedIntoMap(options)

  const [selectedOptions, setSelectedOptions]: [
    string | Readonly<string[]>,
    (option: string | Readonly<string[]>) => void
  ] = useState<string | Readonly<string[]>>(value ?? [])

  const [menuOpened, setMenuOpened]: [boolean, (isOpened: boolean) => void] =
    useState<boolean>(false)

  const [maxOptionsHeight, setMaxOptionsHeight]: [number, (maxOptionsHeight: number) => void] =
    useState<number>(350)

  const selectRef: RefObject<HTMLDivElement> = useRef(null)
  const optionsRef: RefObject<HTMLDivElement> = useRef(null)

  const toggleMenu = useCallback(() => {
    if (!disabled) {
      setMenuOpened(!menuOpened)
    }
  }, [disabled, menuOpened])

  const addOrRemoveOption = (value: string): string[] => {
    if (selectedOptions.includes(value)) {
      return [...selectedOptions].filter((option: string) => option !== value)
    }
    return [...selectedOptions, value]
  }

  const handleOptionSelection = (value: string) => () => {
    if (onValuesChange) {
      if (multiple) {
        const updatedSelection = addOrRemoveOption(value).sort(compareStrings)
        setSelectedOptions(updatedSelection)
      } else {
        setSelectedOptions(value)
      }
    }
    !multiple && toggleMenu()
  }

  const menuIcon = (
    <Icon
      className={classNames(menuOpened && !readOnly ? 'rotate-up' : 'rotate-down')}
      name="arrow-down"
      size={20}
    />
  )

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
    if (onValuesChange) {
      onValuesChange(selectedOptions)
    }
  }, [onValuesChange, selectedOptions])

  useEffect(() => {
    document.addEventListener('keydown', escapeKeyHandler)
    return () => document.removeEventListener('keydown', escapeKeyHandler)
  }, [escapeKeyHandler])

  useEffect(() => {
    document.addEventListener('mousedown', outsideMenuClickHandler)
    return () => document.removeEventListener('mousedown', outsideMenuClickHandler)
  }, [outsideMenuClickHandler])

  const optionsGrouppedEntries = Array.from(optionsGroupped.entries())

  const valueToDisplay = Array.isArray(value) ? value.join(', ') : value

  useEffect(() => {
    if (menuOpened) {
      const selectContainer = document.getElementById(`okp4-select-container ${selectId}`)
      if (selectContainer && optionsRef.current) {
        optionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const maxScrollableDocumentHeight = document.body.offsetHeight
        const selectPositionWithScroll = selectContainer.getBoundingClientRect().bottom + scrollY
        const maxAvailableHeightUnderSelect = maxScrollableDocumentHeight - selectPositionWithScroll
        if (maxAvailableHeightUnderSelect < 350) {
          setMaxOptionsHeight(maxAvailableHeightUnderSelect - 40)
        }
      }
    }
  }, [menuOpened, selectId])

  return (
    <div
      className={classNames(`okp4-select-container ${size}`, {
        'full-width': fullWidth,
        disabled
      })}
      id={`okp4-select-container ${selectId}`}
    >
      <div className={`okp4-select-content ${selectId}`} ref={selectRef}>
        <div
          className={classNames('okp4-select-input-container', {
            error: hasError
          })}
          onClick={toggleMenu}
        >
          <InputBase
            defaultValue={defaultValue}
            disabled={disabled}
            inputRef={inputRef}
            placeholder={placeholder}
            readOnly={readOnly}
            rightIcon={menuIcon}
            value={valueToDisplay}
          />
        </div>
        {menuOpened && !readOnly && (
          <div
            className={classNames('okp4-select-options-container', {
              error: hasError
            })}
            id={`okp4-select-options-container ${selectId}`}
            ref={optionsRef}
            style={{ maxHeight: maxOptionsHeight }}
          >
            {/*eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types*/}
            {optionsGrouppedEntries.map((entry: [string, OptionWithoutGroup[]]) => {
              const [group, options]: [string, OptionWithoutGroup[]] = [...entry]
              return (
                <div
                  className={classNames('okp4-select-options-list', {
                    error: hasError
                  })}
                  key={optionsGrouppedEntries.indexOf(entry)}
                >
                  {group && (
                    <Typography as="div" fontSize="small">
                      <p className="okp4-select-options-group">{group}</p>
                    </Typography>
                  )}
                  <ul>
                    {options.map(({ label, value }: OptionWithoutGroup) => (
                      <li
                        className={classNames('okp4-select-option', {
                          selected: selectedOptions.includes(value)
                        })}
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
      {helperText && (
        <Typography
          as="div"
          color={hasError ? 'error' : 'info'}
          fontSize="x-small"
          fontWeight="bold"
          noWrap
        >
          {helperText}
        </Typography>
      )}
    </div>
  )
}

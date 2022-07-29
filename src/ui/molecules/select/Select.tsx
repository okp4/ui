import React, { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import classNames from 'classnames'
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachArrayWord,
  compareStrings,
  isString
} from 'utils'
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

type InputPropsForSelect = Pick<InputBaseProps, 'placeholder' | 'disabled' | 'hasError'>

export type SelectProps = InputPropsForSelect & {
  /**
   * Defines the callback called when the select value changes.
   */
  readonly onChange: (value: string | Readonly<string[]>) => void
  /**
   * The value of the select.
   */
  readonly value: string | string[]
  /**
   * The options list displayed when the select is opened.
   */
  readonly options: Readonly<Option[]>
  /**
   * If true, allows the user to make a multiple choice.
   * Default to false.
   */
  readonly multiple?: boolean
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
}

// eslint-disable-next-line max-lines-per-function, @typescript-eslint/prefer-readonly-parameter-types
export const Select = ({
  placeholder,
  size = 'small',
  disabled = false,
  hasError = false,
  multiple = false,
  options,
  onChange,
  fullWidth,
  value,
  helperText
}: SelectProps): JSX.Element => {
  const [selectedOption, setSelectedOption]: [
    string | Readonly<string[]>,
    (option: string | Readonly<string[]>) => void
  ] = useState<string | Readonly<string[]>>(value)

  const [menuOpened, setMenuOpened]: [boolean, (isOpened: boolean) => void] =
    useState<boolean>(false)

  const [maxOptionsHeight, setMaxOptionsHeight]: [number, (maxOptionsHeight: number) => void] =
    useState<number>(350)

  const selectId = short.generate()
  const selectRef: RefObject<HTMLDivElement> = useRef(null)
  const optionsRef: RefObject<HTMLDivElement> = useRef(null)

  const toggleMenu = useCallback(() => {
    if (!disabled) {
      setMenuOpened(!menuOpened)
    }
  }, [disabled, menuOpened])

  const addOrRemoveOption = (value: string): string[] => {
    if (selectedOption.includes(value)) {
      return [...selectedOption].filter((option: string) => option !== value)
    }
    return [...selectedOption, value]
  }

  const handleOptionSelection = (value: string) => () => {
    const updatedSelection = multiple ? addOrRemoveOption(value).sort(compareStrings) : value
    setSelectedOption(updatedSelection)
    onChange(updatedSelection)
    !multiple && toggleMenu()
  }

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

  const handleSelectPosition = (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    selectContainer: HTMLElement,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    currentElement: HTMLDivElement
  ): void => {
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const maxScrollableDocumentHeight = document.body.offsetHeight
    const selectPositionWithScroll = selectContainer.getBoundingClientRect().bottom + scrollY
    const maxAvailableHeightUnderSelect = maxScrollableDocumentHeight - selectPositionWithScroll
    if (maxAvailableHeightUnderSelect < 350) {
      setMaxOptionsHeight(maxAvailableHeightUnderSelect - 40)
    }
  }

  const isValueInOptions = (): boolean => {
    const optionsValues: string[] = options.map((option: Option) => option.value)
    if (isString(value)) {
      return optionsValues.includes(value)
    } else {
      return (
        value.length > 0 &&
        value.every((optionValue: string) => optionsValues.includes(optionValue))
      )
    }
  }

  const capitalizeLabelsFirstLetter = (labels: Readonly<string[]>): string => {
    return capitalizeFirstLetterOfEachArrayWord(labels).sort(compareStrings).join(', ')
  }

  const getAssociatedLabel = (value: string): string => {
    const foundLabel = options.find((option: Option) => option.value === value)?.label
    return foundLabel ?? ''
  }

  const getAssociatedLabels = (value: Readonly<string[]>): string[] => {
    return value.map((value: string) => getAssociatedLabel(value))
  }

  const capitalizedLabel = (): string => {
    if (isString(value)) {
      const label = getAssociatedLabel(value)
      return capitalizeFirstLetter(label)
    } else {
      const labels = getAssociatedLabels(value)
      return capitalizeLabelsFirstLetter(labels)
    }
  }

  const labelToDisplay = isValueInOptions() ? capitalizedLabel() : ''

  useEffect(() => {
    document.addEventListener('keydown', escapeKeyHandler)
    return () => document.removeEventListener('keydown', escapeKeyHandler)
  }, [escapeKeyHandler])

  useEffect(() => {
    document.addEventListener('mousedown', outsideMenuClickHandler)
    return () => document.removeEventListener('mousedown', outsideMenuClickHandler)
  }, [outsideMenuClickHandler])

  useEffect(() => {
    if (menuOpened) {
      const selectContainer = document.getElementById(`okp4-select-container ${selectId}`)
      if (selectContainer !== null && optionsRef.current) {
        handleSelectPosition(selectContainer, optionsRef.current)
      }
    }
  }, [menuOpened, selectId])

  const menuIcon = (
    <Icon
      className={classNames(menuOpened ? 'rotate-up' : 'rotate-down')}
      name="arrow-down"
      size={20}
    />
  )

  const groups: Set<string> = new Set()
  const optionsWithoutGroups: Option[] = []
  options.map((option: Readonly<Option>) => {
    option.group ? groups.add(option.group) : optionsWithoutGroups.push(option)
  })

  const renderOption = (label: string, value: string): JSX.Element => {
    return (
      <li
        className={classNames('okp4-select-option', {
          selected: selectedOption.includes(value)
        })}
        key={value}
        onClick={handleOptionSelection(value)}
      >
        {capitalizeFirstLetter(label)}
      </li>
    )
  }

  const renderOptionsWithoutGroup = (): JSX.Element => {
    return (
      <div>
        <ul className="okp4-select-options">
          {optionsWithoutGroups.map(({ label, value }: Option) => {
            return renderOption(label, value)
          })}
        </ul>
      </div>
    )
  }

  const needDivider = (group: string): boolean => {
    const isNotLastGroup = [...groups].indexOf(group) !== groups.size - 1
    return (
      (groups.size > 0 && isNotLastGroup) || (groups.size > 0 && optionsWithoutGroups.length > 0)
    )
  }

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
            disabled={disabled}
            placeholder={placeholder}
            readOnly
            rightIcon={menuIcon}
            value={labelToDisplay}
          />
        </div>
        {menuOpened && (
          <div
            className={classNames('okp4-select-options-container', {
              error: hasError
            })}
            id={`okp4-select-options-container ${selectId}`}
            ref={optionsRef}
            style={{ maxHeight: maxOptionsHeight }}
          >
            <div
              className={classNames('okp4-select-options-menu', {
                error: hasError
              })}
            >
              {groups.size ? (
                <div className="okp4-select-options-with-group">
                  {[...groups].map((groupName: string) => {
                    return (
                      <div key={groupName}>
                        <Typography fontSize="small" fontWeight="bold" key={groupName}>
                          <p className="okp4-select-options-group">
                            {capitalizeFirstLetter(groupName)}
                          </p>
                        </Typography>
                        <ul className="okp4-select-options">
                          {options.map(({ label, value, group }: Option) => {
                            return group && group === groupName && renderOption(label, value)
                          })}
                        </ul>
                        {needDivider(groupName) && <div className="okp4-select-group-divider" />}
                      </div>
                    )
                  })}
                  {renderOptionsWithoutGroup()}
                </div>
              ) : (
                renderOptionsWithoutGroup()
              )}
            </div>
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

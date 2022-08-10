import React, { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import {
  capitalizeFirstLetter,
  capitalizeFirstLetterOfEachArrayWord,
  compareStrings,
  isString
} from 'utils'
import type { SelectOption } from 'utils'
import type { DeepReadonly, UseState } from 'superTypes'
import { InputBase } from 'ui/atoms/inputBase/InputBase'
import type { InputBaseProps } from 'ui/atoms/inputBase/InputBase'
import { Typography } from 'ui/atoms/typography/Typography'
import { Icon } from 'ui/atoms/icon/Icon'
import './select.scss'
import { useOnClickOutside } from 'hook/useOnClickOutside'

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
  readonly options: Readonly<SelectOption[]>
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
}: DeepReadonly<SelectProps>): JSX.Element => {
  const [selectedOption, setSelectedOption]: UseState<string | Readonly<string[]>> = useState<
    string | Readonly<string[]>
  >(value)

  const [menuOpened, setMenuOpened]: UseState<boolean> = useState<boolean>(false)
  const [maxOptionsHeight, setMaxOptionsHeight]: UseState<number> = useState<number>(350)

  const selectContainerRef = useRef<HTMLDivElement | null>(null)
  const selectRef = useRef<HTMLDivElement | null>(null)
  const optionsRef = useRef<HTMLDivElement | null>(null)

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

  useOnClickOutside(selectRef, (): void => {
    setMenuOpened(false)
  })

  const handleSelectPosition = (
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    selectContainer: HTMLDivElement,
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
    const optionsValues: string[] = options.map((option: SelectOption) => option.value)
    if (isString(value)) {
      return optionsValues.includes(value)
    }
    return (
      value.length > 0 && value.every((optionValue: string) => optionsValues.includes(optionValue))
    )
  }

  const capitalizeLabelsFirstLetter = (labels: Readonly<string[]>): string => {
    return capitalizeFirstLetterOfEachArrayWord(labels).sort(compareStrings).join(', ')
  }

  const getAssociatedLabel = (value: string): string => {
    const foundLabel = options.find((option: SelectOption) => option.value === value)?.label
    return foundLabel ?? ''
  }

  const getAssociatedLabels = (value: Readonly<string[]>): string[] => {
    return value.map((value: string) => getAssociatedLabel(value))
  }

  const capitalizedLabel = (): string => {
    if (isString(value)) {
      const label = getAssociatedLabel(value)
      return capitalizeFirstLetter(label)
    }
    const labels = getAssociatedLabels(value)
    return capitalizeLabelsFirstLetter(labels)
  }

  const labelToDisplay = isValueInOptions() ? capitalizedLabel() : ''
  const groups: Set<string> = new Set()
  const optionsWithoutGroups: SelectOption[] = []
  options.map((option: Readonly<SelectOption>) => {
    option.group ? groups.add(option.group) : optionsWithoutGroups.push(option)
  })

  const needDivider = (group: string): boolean => {
    const isNotLastGroup = [...groups].indexOf(group) !== groups.size - 1
    return (
      (groups.size > 0 && isNotLastGroup) || (groups.size > 0 && optionsWithoutGroups.length > 0)
    )
  }

  const MenuIcon = (): JSX.Element => (
    <Icon
      className={classNames(menuOpened ? 'rotate-up' : 'rotate-down')}
      name="arrow-down"
      size={20}
    />
  )

  const Option = ({ label, value }: SelectOption): JSX.Element => {
    return (
      <li
        className={classNames('okp4-select-option', {
          selected: selectedOption.includes(value)
        })}
        onClick={handleOptionSelection(value)}
      >
        {capitalizeFirstLetter(label)}
      </li>
    )
  }

  const OptionsWithoutGroup = (): JSX.Element => {
    return (
      <div>
        <ul className="okp4-select-options">
          {optionsWithoutGroups.map(({ label, value }: SelectOption) => {
            return <Option key={value} label={label} value={value} />
          })}
        </ul>
      </div>
    )
  }

  useEffect(() => {
    document.addEventListener('keydown', escapeKeyHandler)
    return () => document.removeEventListener('keydown', escapeKeyHandler)
  }, [escapeKeyHandler])

  useEffect(() => {
    if (menuOpened && selectContainerRef.current !== null && optionsRef.current) {
      handleSelectPosition(selectContainerRef.current, optionsRef.current)
    }
  }, [menuOpened])

  return (
    <div
      className={classNames(`okp4-select-container ${size}`, {
        'full-width': fullWidth,
        disabled
      })}
      ref={selectContainerRef}
    >
      <div className={`okp4-select-content`} ref={selectRef}>
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
            rightIcon={<MenuIcon />}
            value={labelToDisplay}
          />
        </div>
        {menuOpened && (
          <div
            className={classNames('okp4-select-options-container', {
              error: hasError
            })}
            ref={optionsRef}
            style={{ maxHeight: maxOptionsHeight }}
          >
            <div
              className={classNames('okp4-select-options-menu', {
                error: hasError
              })}
            >
              {groups.size ? (
                <div>
                  {[...groups].map((groupName: string) => {
                    return (
                      <div key={groupName}>
                        <Typography fontSize="small" fontWeight="bold" key={groupName}>
                          <p className="okp4-select-options-group">
                            {capitalizeFirstLetter(groupName)}
                          </p>
                        </Typography>
                        <ul className="okp4-select-options">
                          {options.map(({ label, value, group }: SelectOption) => {
                            return (
                              group && group === groupName && <Option label={label} value={value} />
                            )
                          })}
                        </ul>
                        {needDivider(groupName) && <div className="okp4-select-group-divider" />}
                      </div>
                    )
                  })}
                  <OptionsWithoutGroup />
                </div>
              ) : (
                <OptionsWithoutGroup />
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

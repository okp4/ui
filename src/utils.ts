import type { DeepReadonly, FileSizeUnit, ReadableFileSize } from 'superTypes'

export const asImmutable = <T>(o?: T): DeepReadonly<T> => o as DeepReadonly<T>

export const asMutable = <T, U extends DeepReadonly<T>>(o?: U): T => o as T

export type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T
export const truthy = <T>(value: T): value is Truthy<T> => Boolean(value)

export const toPercent = (value: number, min: number, max: number): number => {
  if (min > max) {
    return 0
  }
  const totalScale = max - min
  const valueInScale = value - min
  if (value > max) {
    return 100
  }
  if (value < min) {
    return 0
  }
  return totalScale ? (100 * valueInScale) / totalScale : 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isString = (value: any): value is string => typeof value === 'string'

export const compareStrings = (
  referenceStr: string,
  compareString: string,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  locales?: string | string[],
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  options?: Intl.CollatorOptions | undefined
): number => referenceStr.localeCompare(compareString, locales, options)

export type SelectOption = {
  readonly label: string
  readonly value: string
  readonly group?: string
}

const selectOptionAscComparator = (
  option1: Readonly<SelectOption>,
  option2: Readonly<SelectOption>
): number => {
  const groupComparison = compareStrings(option1.group ?? '', option2.group ?? '')

  if (groupComparison !== 0) {
    return groupComparison
  }

  return compareStrings(option1.value, option2.value)
}

const selectOptionDescComparator = (option1: SelectOption, option2: SelectOption): number =>
  -1 * selectOptionAscComparator(option1, option2)

export const sortSelectOptionAsc = (options: Readonly<SelectOption[]>): SelectOption[] =>
  [...options].sort(selectOptionAscComparator)

export const sortSelectOptionDesc = (options: Readonly<SelectOption[]>): SelectOption[] =>
  [...options].sort(selectOptionDescComparator)

/**
 * Convert a byte size into a more readable value.
 * @param size The size to convert.
 * @returns An object containing the value and the size unit.
 */
export const toReadableFileSize = (
  size: number,
  formatter?: (size: number) => number
): ReadableFileSize =>
  (['KB', 'MB', 'GB', 'TB'] as FileSizeUnit[]).reduce<ReadableFileSize>(
    (acc: DeepReadonly<ReadableFileSize>, curr: FileSizeUnit) =>
      acc.value < 1000
        ? { value: acc.value, unit: acc.unit }
        : { value: formatter ? formatter(acc.value / 1000) : acc.value / 1000, unit: curr },
    { value: size, unit: 'B' }
  )

/**
 * Check if the file has the given MIME type or extension
 * @param file The file to check.
 * @param acceptedFormat The accepted MIME type or extension of the file.
 * @returns A boolean that indicates if the file match the MIME type or the extension.
 */
export const isFileTypeAccepted = (file: DeepReadonly<File>, acceptedFormat: string): boolean => {
  const suffixMimeTypeRegex = /\/.*$/
  const fileName = file.name.toLocaleLowerCase()
  const mimeType = file.type.toLocaleLowerCase()
  const baseMimeType = mimeType.replace(suffixMimeTypeRegex, '')

  const type = acceptedFormat.trim().toLocaleLowerCase()
  return (
    !type ||
    mimeType === type ||
    (type.endsWith('/*') && baseMimeType === type.replace(suffixMimeTypeRegex, '')) ||
    (type.startsWith('.') && fileName.endsWith(type))
  )
}

/**
 * Check if each file has one of the MIME types or extensions.
 * @param files The files to check.
 * @param acceptedFormats The accepted formats (MIME type or extension) of the files.
 * @returns A boolean that indicates if the files matches the MIME types or extensions.
 */
export const areFilesAccepted = (
  files: DeepReadonly<File[]>,
  acceptedFormats?: Readonly<string[]>
): boolean =>
  files.every(
    (file: DeepReadonly<File>) =>
      !acceptedFormats ||
      !acceptedFormats.length ||
      acceptedFormats.some((format: string) => isFileTypeAccepted(file, format))
  )

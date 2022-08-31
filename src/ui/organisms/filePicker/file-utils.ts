import type { DeepReadonly, SizeUnit } from 'superTypes'

/**
 * Convert a byte size into its more readable value.
 * @param size The size to convert.
 * @returns An objects containing the value and the size unit.
 */
export const toReadableSize = (size: number): { value: string; unit: SizeUnit } => {
  const units: SizeUnit[] = ['KB', 'MB', 'GB', 'TB']
  const { value, unit } = units.reduce(
    (acc: { value: number; unit: SizeUnit }, curr: SizeUnit) => {
      return acc.value < 1000
        ? { value: acc.value, unit: acc.unit }
        : { value: acc.value / 1000, unit: curr }
    },
    {
      value: size,
      unit: 'B'
    }
  )
  return { value: value.toFixed(2), unit }
}

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
    (type.charAt(0) === '.' && fileName.endsWith(type))
  )
}

/**
 * Check if each file has one of the MIME types or extensions.
 * @param files The files to check.
 * @param acceptedFormats The accepted formats (MIME type or extension) of the files.
 * @returns A boolean that indicates if the files match the MIME types or extensions.
 */
export const areFilesAccepted = (
  files: DeepReadonly<File[]>,
  acceptedFormats?: Readonly<string[]>
): boolean =>
  files.every((file: DeepReadonly<File>) => {
    return (
      !acceptedFormats ||
      !acceptedFormats.length ||
      acceptedFormats.some((format: string) => isFileTypeAccepted(file, format))
    )
  })

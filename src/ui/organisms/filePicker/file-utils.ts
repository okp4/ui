import type { DeepReadonly, SizeUnit } from 'superTypes'

/**
 * Convert a byte size into its more readable value.
 * @param size The size to convert.
 * @returns An objects containing the value and the size unit.
 */
export const convertSize = (size: number): { value: string; unit: SizeUnit } => {
  const tb = Math.pow(10, 12)
  const gb = Math.pow(10, 9)
  const mb = Math.pow(10, 6)
  const kb = Math.pow(10, 3)

  if (size > tb) {
    return { value: (size / tb).toFixed(2), unit: 'TB' }
  }
  if (size > gb) {
    return { value: (size / gb).toFixed(2), unit: 'GB' }
  }
  if (size > mb) {
    return { value: (size / mb).toFixed(2), unit: 'MB' }
  }
  if (size > kb) {
    return { value: (size / kb).toFixed(2), unit: 'KB' }
  }
  return { value: size.toFixed(2), unit: 'B' }
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

  return (
    mimeType === acceptedFormat ||
    baseMimeType === acceptedFormat.replace(suffixMimeTypeRegex, '') ||
    fileName.endsWith(acceptedFormat)
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

import type { DeepReadonly } from 'superTypes'

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

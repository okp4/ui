export type UploadFiles<I = string> = {
  filePortId: string
  target: string
  fileIds?: I[]
}

export type Status = 'processing' | 'success' | 'error'
export type Progress = {
  min?: number
  max?: number
  current?: number
}

import type { UseTranslationResponse } from 'react-i18next'
import { useTranslation as useI18n } from 'react-i18next'

export const useTranslation = (namespace?: string): UseTranslationResponse<string> =>
  useI18n(namespace)

import type { UseTranslationResponse as UseI18nTranslationResponse } from 'react-i18next'
import { useTranslation as useI18n } from 'react-i18next'

export type UseTranslationResponse = UseI18nTranslationResponse<string>

export const useTranslation = (namespace?: string): UseTranslationResponse =>
  useI18n(namespace)

import filePicker_en from './filePicker_en.json'
import filePicker_fr from './filePicker_fr.json'
import type { I18nResource } from 'i18n/utils'
import { loadTranslations } from 'i18n/utils'

const i18nErrorTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'filePicker', resource: filePicker_en },
  { lng: 'fr', namespace: 'filePicker', resource: filePicker_fr }
]

loadTranslations(i18nErrorTranslations)

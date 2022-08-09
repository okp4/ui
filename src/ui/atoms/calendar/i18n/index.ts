import calendar_en from './calendar_en.json'
import calendar_fr from './calendar_fr.json'
import type { I18nResource } from 'i18n/utils'
import { loadTranslations } from 'i18n/utils'

const i18nLabelTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'calendar', resource: calendar_en },
  { lng: 'fr', namespace: 'calendar', resource: calendar_fr }
]

loadTranslations(i18nLabelTranslations)

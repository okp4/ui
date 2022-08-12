import datepicker_en from './datepicker_en.json'
import datepicker_fr from './datepicker_fr.json'
import type { I18nResource } from 'i18n/utils'
import { loadTranslations } from 'i18n/utils'

const i18nLabelTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'datepicker', resource: datepicker_en },
  { lng: 'fr', namespace: 'datepicker', resource: datepicker_fr }
]

loadTranslations(i18nLabelTranslations)

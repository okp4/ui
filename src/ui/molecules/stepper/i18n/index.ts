import stepper_en from './stepper_en.json'
import stepper_fr from './stepper_fr.json'
import type { I18nResource } from 'i18n/utils'
import { loadTranslations } from 'i18n/utils'

const i18nLabelTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'stepper', resource: stepper_en },
  { lng: 'fr', namespace: 'stepper', resource: stepper_fr }
]

loadTranslations(i18nLabelTranslations)

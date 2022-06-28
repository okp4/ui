import errorDomain_en from './errorDomain_en.json'
import errorDomain_fr from './errorDomain_fr.json'
import type { I18nResource } from 'i18n/utils'
import { loadTranslations } from 'i18n/utils'

const i18nErrorTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'errorDomain', resource: errorDomain_en },
  { lng: 'fr', namespace: 'errorDomain', resource: errorDomain_fr }
]

loadTranslations(i18nErrorTranslations)

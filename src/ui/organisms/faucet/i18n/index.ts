import faucet_en from './faucet_en.json'
import faucet_fr from './faucet_fr.json'
import type { I18nResource } from 'i18n/utils'
import { loadTranslations } from 'i18n/utils'

const i18nErrorTranslations: I18nResource[] = [
  { lng: 'en', namespace: 'faucet', resource: faucet_en },
  { lng: 'fr', namespace: 'faucet', resource: faucet_fr }
]

loadTranslations(i18nErrorTranslations)

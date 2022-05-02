import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translation_en from './translation_en.json'
import translation_fr from './translation_fr.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      htmlTag: document.documentElement
    },
    resources: {},
    fallbackLng: 'en',
    fallbackNS: 'translation',
    interpolation: {
      escapeValue: true,
      // eslint-disable-next-line @typescript-eslint/typedef
      format: (value, format): string => {
        if (!value) {
          return ''
        }
        if (format === 'uppercase') {
          return value.toUpperCase()
        }
        if (format === 'lowercase') {
          return value.toLowerCase()
        }
        return value
      }
    },
    react: {
      useSuspense: true
    }
  })

i18n.addResourceBundle('en', 'translation', translation_en, true)
i18n.addResourceBundle('fr', 'translation', translation_fr, true)

export default i18n

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
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

export default i18n

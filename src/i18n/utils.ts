/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { JSONValue } from 'superTypes'
import i18n from '../i18n/index'
import translation_en from './translation_en.json'
import translation_fr from './translation_fr.json'

export type I18nResource = Readonly<{
  readonly lng: string
  readonly namespace: string
  readonly resource: JSONValue
}>

export const loadTranslations = (resources: Array<I18nResource>): void => {
  resources.forEach((resource: I18nResource) =>
    i18n.addResourceBundle(resource.lng, resource.namespace, resource.resource, true)
  )
}

export const loadDefaultTranslations = (): void => {
  loadTranslations([
    { lng: 'en', namespace: 'translation', resource: translation_en },
    { lng: 'fr', namespace: 'translation', resource: translation_fr }
  ])
}

export const isCurrentLanguage = (lng: string): boolean =>
  i18n.language.toLowerCase() === lng.toLowerCase()

export const changeLanguage = (newLanguage: string): void => {
  i18n.changeLanguage(newLanguage)
}

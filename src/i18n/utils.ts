/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { JSONValue } from 'superTypes'
import i18n from '../i18n/index'

export type I18nResource = Readonly<{
  readonly lng: string
  readonly namespace: string
  readonly resource: JSONValue
}>

export const loadTranslations = (resources: Array<I18nResource>, overwrite?: boolean): void => {
  resources.forEach((resource: I18nResource) =>
    i18n.addResourceBundle(resource.lng, resource.namespace, resource.resource, !overwrite, overwrite)
  )
}

export const updateLanguage = (lng: string ): void => {
  i18n.changeLanguage(lng)
}

export const isCurrentLanguage = (lng: string): boolean => { 
  const languageValueRegex = new RegExp(lng, 'i')
  return languageValueRegex.test(i18n.language)
}

export const updateLanguage = (language: string ): void => {
  const previousLanguage = localStorage.getItem('i18nextLng')
  if (previousLanguage && previousLanguage !== language) {
    i18n.changeLanguage(language).then(()=>
      localStorage.setItem('i18nextLng', language)
    )
  }
}

export const isCurrentLanguage = (lng: string): boolean =>
  i18n.language.toLowerCase() === lng.toLowerCase()
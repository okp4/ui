import React from 'react'
import classNames from 'classnames'
import { isCurrentLanguage, loadTranslations, updateLanguage } from '../../../i18n/utils'
import type { I18nResource } from '../../../i18n/utils'
import type { Language, Languages } from '../../../i18n/types'
import { Typography } from '../typography/Typography'
import languageSwitcher_en from './i18n/languageSwitcher_en.json'
import languageSwitcher_fr from './i18n/languageSwitcher_fr.json'
import { useTranslation } from 'hook/useTranslation'
import type { UseTranslationResponse } from 'hook/useTranslation'
import type { Breakpoints } from 'hook/useBreakpoint'
import { useBreakpoint } from 'hook/useBreakpoint'
import type { DeepReadonly } from 'superTypes'
import './languageSwitcher.scss'

export type LanguageSwitcherProps = DeepReadonly<{
  /**
   * The available languages for the application
   */
  readonly languages: Languages
}>

const languagesTranslation: I18nResource[] = [
  { lng: 'en', namespace: 'languageSwitcher', resource: languageSwitcher_en },
  { lng: 'fr', namespace: 'languageSwitcher', resource: languageSwitcher_fr }
]

loadTranslations(languagesTranslation)

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  languages
}: LanguageSwitcherProps): JSX.Element => {
  const { t }: UseTranslationResponse = useTranslation('languageSwitcher')
  const { isXSmall }: Breakpoints = useBreakpoint()

  const handleLanguageUpdate = (language: string) => (): void => {
    updateLanguage(language)
  }

  return (
    <div className="okp4-language-switcher-main">
      <div className="okp4-languages">
        <Typography as="p" color="highlighted-text" fontSize="x-small" fontWeight="xlight" noWrap>
          {t('languages')}
        </Typography>
      </div>
      {languages.map((language: Readonly<Language>) => {
        const isLastLanguage = languages.indexOf(language) === languages.length - 1

        return (
          <div className="okp4-language-container" key={language.lng}>
            <div
              className={classNames('okp4-language', {
                'is-selected': isCurrentLanguage(language.lng)
              })}
              onClick={handleLanguageUpdate(language.lng)}
            >
              <Typography
                as="p"
                color="highlighted-text"
                fontSize="x-small"
                fontWeight="xlight"
                noWrap
              >
                {language.name}
              </Typography>
            </div>
            {!isXSmall && !isLastLanguage && (
              <Typography as="p" color="highlighted-text" fontSize="x-small" fontWeight="xlight">
                |
              </Typography>
            )}
          </div>
        )
      })}
    </div>
  )
}

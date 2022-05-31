import React from 'react'
import classNames from 'classnames'
import { isCurrentLanguage, loadTranslations, updateLanguage } from '../../../i18n/utils'
import type { I18nResource } from '../../../i18n/utils'
import type { TLanguage, TLanguages } from '../../../i18n/types'
import { Typography } from '../typography/Typography'
import languageSwitcher_en from './i18n/languageSwitcher_en.json'
import languageSwitcher_fr from './i18n/languageSwitcher_fr.json'
import { useTranslation } from 'hook/useTranslation'
import type { Breakpoints } from 'hook/useBreakpoint'
import { useBreakpoint } from 'hook/useBreakpoint'
import './languageSwitcher.scss'

const languagesTranslation: I18nResource[] = [
  { lng: 'en', namespace: 'languageSwitcher', resource: languageSwitcher_en },
  { lng: 'fr', namespace: 'languageSwitcher', resource: languageSwitcher_fr }
]

loadTranslations(languagesTranslation)

const languages: TLanguages = [
  { name: 'English', value: 'en-EN' },
  { name: 'Français', value: 'fr-FR' }
]

export const LanguageSwitcher: React.FC = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/typedef
  const { t } = useTranslation('languageSwitcher')
  const { isXSmall }: Breakpoints = useBreakpoint()

  const handleLanguageUpdate = (language: string) => (): void => {
    updateLanguage(language)
  }

  return (
    <div className="language-switcher-main">
      <div className="languages-translation">
        <Typography as="p" color="highlighted-text" fontSize="x-small" fontWeight="xlight" noWrap>
          {t('languages')}
        </Typography>
      </div>
      {languages.map((language: Readonly<TLanguage>) => {
        const isLastLanguage = languages.indexOf(language) === languages.length - 1

        return (
          <div className="language-container" key={language.value}>
            <div
              className={classNames('language', {
                'is-selected': isCurrentLanguage(language.value)
              })}
              onClick={handleLanguageUpdate(language.value)}
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

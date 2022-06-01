import React from 'react'
import classNames from 'classnames'
import { isCurrentLanguage, loadTranslations, updateLanguage } from '../../../i18n/utils'
import type { I18nResource } from '../../../i18n/utils'
import type { Language, Languages } from '../../../i18n/types'
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

const languages: Languages = [
  { name: 'English', iso: 'en' },
  { name: 'Français', iso: 'fr' }
]

export const LanguageSwitcher: React.FC = (): JSX.Element => {
  // waiting for the useTranslation response missing type
  // eslint-disable-next-line @typescript-eslint/typedef
  const { t } = useTranslation('languageSwitcher')
  const { isXSmall }: Breakpoints = useBreakpoint()

  const handleLanguageUpdate = (language: string) => (): void => {
    updateLanguage(language)
  }

  return (
    <div className="okp4-language-switcher-main">
      <div className="okp4-languages-translation">
        <Typography as="p" color="highlighted-text" fontSize="x-small" fontWeight="xlight" noWrap>
          {t('languages')}
        </Typography>
      </div>
      {languages.map((language: Readonly<Language>) => {
        const isLastLanguage = languages.indexOf(language) === languages.length - 1

        return (
          <div className="okp4-language-container" key={language.iso}>
            <div
              className={classNames('okp4-language', {
                'is-selected': isCurrentLanguage(language.iso)
              })}
              onClick={handleLanguageUpdate(language.iso)}
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

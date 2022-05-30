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
      <p className="languages-translation">{t('languages')}</p>
      {languages.map((language: Readonly<TLanguage>) => {
        return (
          <Typography as="div" fontSize="small" key={language.name} noWrap>
            <p>
              <span
                className={classNames('language', {
                  'is-selected': isCurrentLanguage(language.value)
                })}
                onClick={handleLanguageUpdate(language.value)}
              >
                {language.name}
              </span>
              {!isXSmall && languages.indexOf(language) !== languages.length - 1 && (
                <span className="languages-divider">|</span>
              )}
            </p>
          </Typography>
        )
      })}
    </div>
  )
}

import React from 'react'
import type { Languages } from '../../../i18n/types'
import { Typography } from 'ui/atoms/typography/Typography'
import { LanguageSwitcher } from '../../atoms/languageSwitcher/LanguageSwitcher'
import type { I18nResource } from '../../../i18n/utils'
import { loadTranslations } from '../../../i18n/utils'
import { useTranslation } from '../../../hook/useTranslation'
import footer_en from './i18n/footer_en.json'
import footer_fr from './i18n/footer_fr.json'
import './footer.scss'

const languages: Languages = [
  {
    name: 'English',
    lng: 'en'
  },
  {
    name: 'Français',
    lng: 'fr'
  }
]

const translationsToLoad: I18nResource[] = [
  { lng: 'en', namespace: 'footer', resource: footer_en },
  { lng: 'fr', namespace: 'footer', resource: footer_fr }
]
loadTranslations(translationsToLoad)

export const Footer: React.FC = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/typedef
  const { t } = useTranslation()
  return (
    <div className="okp4-footer-main">
      <div className="okp4-footer-language-container">
        <LanguageSwitcher languages={languages} />
      </div>
      <div className="okp4-footer-brand-link-container">
        <Typography as="p" color="highlighted-text" fontSize="x-small" fontWeight="xlight">
          {t('footer:brand-link')}{' '}
          <Typography color="highlighted-text" fontSize="x-small" fontWeight="bold" noWrap>
            <a href="https://okp4.network" rel="author noreferrer" target="_blank">
              ØKP4
            </a>
          </Typography>
        </Typography>
      </div>
    </div>
  )
}

import React from 'react'
import { Typography } from 'ui/atoms/typography/Typography'
import type { I18nResource } from '../../../i18n/utils'
import { loadTranslations } from '../../../i18n/utils'
import { useTranslation } from '../../../hook/useTranslation'
import footer_en from './i18n/footer_en.json'
import footer_fr from './i18n/footer_fr.json'
import './footer.scss'

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
      <div className="okp4-footer-language-container"></div>
      <div className="okp4-footer-brand-link-container">
        <Typography as="p" color="highlighted-text" fontSize="x-small" fontWeight="xlight">
          {t('footer:brand-link')}
        </Typography>
        <Typography as="p" color="highlighted-text" fontSize="x-small" fontWeight="bold">
          <a href="https://okp4.network" rel="author noreferrer" target="_blank">
            ØKP4
          </a>
        </Typography>
      </div>
    </div>
  )
}

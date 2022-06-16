import React from 'react'
import type { Languages } from '../../../i18n/types'
import { LanguageSwitcher } from '../../atoms/languageSwitcher/LanguageSwitcher'
import type { DeepReadonly } from 'superTypes'
import './footer.scss'

type FooterProps = DeepReadonly<{
  /**
   * The languages used for the translation service.
   */
  readonly languages: DeepReadonly<Languages>
  /**
   * Secondary element used to render additional element(s).
   */
  readonly secondaryElement?: DeepReadonly<JSX.Element>
}>

export const Footer: React.FC<FooterProps> = ({
  languages,
  secondaryElement
}: FooterProps): JSX.Element => {
  return (
    <div className="okp4-footer-main">
      <LanguageSwitcher languages={languages} />
      {secondaryElement && secondaryElement}
    </div>
  )
}

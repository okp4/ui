import React from 'react'
import type { Languages } from 'i18n/types'
import { LanguageSwitcher } from 'ui/atoms/languageSwitcher/LanguageSwitcher'
import type { DeepReadonly } from 'superTypes'
import './footer.scss'

export type FooterProps = DeepReadonly<{
  /**
   * The languages used for the translation service.
   */
  readonly languages: DeepReadonly<Languages>
  /**
   * Last element used to render additional element(s).
   */
  readonly lastElement?: DeepReadonly<JSX.Element>
}>

export const Footer: React.FC<FooterProps> = ({
  languages,
  lastElement
}: FooterProps): JSX.Element => {
  return (
    <div className="okp4-footer-main">
      <LanguageSwitcher languages={languages} />
      {lastElement && lastElement}
    </div>
  )
}

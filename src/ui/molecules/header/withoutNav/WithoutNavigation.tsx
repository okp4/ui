import React from 'react'
import './withoutNavigation.scss'
import type { DeepReadonly } from 'superTypes'
import { ThemeSwitcher } from 'ui/atoms/theme/ThemeSwitcher'

type HeaderWithoutNavProps = {
  readonly firstElement: JSX.Element
  readonly containerClass: string
}

export const WithoutNavigation = ({
  firstElement,
  containerClass
}: DeepReadonly<HeaderWithoutNavProps>): JSX.Element => (
  <div className="okp4-header-main-without-nav">
    <div className={containerClass}>{firstElement}</div>
    <div className="okp4-header-theme-switcher-container-without">
      <ThemeSwitcher />
    </div>
  </div>
)

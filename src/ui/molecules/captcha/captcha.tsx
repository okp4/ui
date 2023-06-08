import React, { useRef, useMemo } from 'react'
import type { FC } from 'react'
import { useCaptcha } from 'hook/useCaptcha'
import type { DeepReadonly } from 'superTypes'
import { uuid } from 'short-uuid'

type CaptchaProvider = 'g-recaptcha'

type CaptchaType<T extends CaptchaProvider> = { captchaType: T }

type GRecaptcha = {
  sitekey: string
  onSuccess: (result: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark'
} & CaptchaType<'g-recaptcha'>

export type Captcha = GRecaptcha

type CaptchaProps = {
  captcha: Captcha
}

export const Captcha: FC<CaptchaProps> = ({ captcha }: DeepReadonly<CaptchaProps>) => {
  const componentRef = useRef<HTMLDivElement>(null)
  const id = useMemo(() => uuid(), [])

  const className = useMemo(() => {
    switch (captcha.captchaType) {
      case 'g-recaptcha':
        return 'g-recaptcha'
    }
  }, [captcha.captchaType])

  useCaptcha(captcha, componentRef)

  return <div className={className} id={id} ref={componentRef} />
}

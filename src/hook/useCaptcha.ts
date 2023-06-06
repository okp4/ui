import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { useTheme } from 'hook/useTheme'
import type { ThemeContextType } from 'context/themeContext'
import type { DeepReadonly } from 'superTypes'
import type { Captcha } from 'ui/molecules/captcha/captcha'
import i18n from 'i18n/index'

// eslint-disable-next-line max-lines-per-function
export const useCaptcha = (
  captcha: DeepReadonly<Captcha>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  ref: Readonly<RefObject<HTMLDivElement>>
): void => {
  const { theme: contextTheme }: ThemeContextType = useTheme()
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  // eslint-disable-next-line max-lines-per-function
  useEffect(() => {
    switch (captcha.captchaType) {
      case 'g-recaptcha': {
        const NORMAL_WIDGET_WIDTH = 304
        const SCRIPT_ID = 'grecaptcha-script'
        const parentWidth = ref.current?.parentElement?.getBoundingClientRect().width ?? Infinity
        const widgetSize = parentWidth >= NORMAL_WIDGET_WIDTH ? 'normal' : 'compact'

        const onLoad = (): void => {
          const grecaptchas = document.getElementsByClassName('g-recaptcha')
          // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
          Array.from(grecaptchas).map((grecaptcha: Readonly<Element>) => {
            !grecaptcha.childElementCount &&
              window.grecaptcha?.render(grecaptcha, {
                sitekey: captcha.sitekey,
                theme: captcha.theme ?? contextTheme,
                size: widgetSize,
                callback: captcha.onSuccess,
                'expired-callback': captcha.onExpire,
                'error-callback': captcha.onError
              })
          })
        }

        window.grecaptchaOnLoad = onLoad

        const script = Object.assign(document.createElement('script'), {
          async: true,
          id: SCRIPT_ID,
          defer: true,
          src: `https://www.google.com/recaptcha/api.js?onload=grecaptchaOnLoad&render=explicit&hl=${i18n.language}`
        })
        scriptRef.current = script
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    captcha.captchaType,
    captcha.onError,
    captcha.onExpire,
    captcha.onSuccess,
    captcha.sitekey,
    captcha.theme,
    contextTheme,
    ref,
    window.grecaptchaOnLoad
  ])

  useEffect(() => {
    const existingScript = scriptRef.current && document.getElementById(scriptRef.current.id)
    if (!existingScript && scriptRef.current) document.head.append(scriptRef.current)

    return () => {
      const existingScript = scriptRef.current && document.getElementById(scriptRef.current.id)
      existingScript?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptRef.current])
}

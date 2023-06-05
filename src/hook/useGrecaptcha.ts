import { useCallback, useEffect, useMemo } from 'react'
import i18n from 'i18n/index'

export const useGrecaptcha = (): void => {
  const SCRIPT_ID = 'grecaptcha-script'

  const onLoad = useCallback(() => {
    const grecaptchas = document.getElementsByClassName('g-recaptcha')
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    Array.from(grecaptchas).map((grecaptcha: Readonly<Element>) => {
      !grecaptcha.childElementCount && window.grecaptcha?.render(grecaptcha)
    })
  }, [])

  window.grecaptchaOnLoad = onLoad

  const script = useMemo(
    () =>
      Object.assign(document.createElement('script'), {
        async: true,
        id: SCRIPT_ID,
        defer: true,
        src: `https://www.google.com/recaptcha/api.js?onload=grecaptchaOnLoad&render=explicit&hl=${i18n.language}`
      }),
    []
  )

  useEffect(() => {
    const existingScript = document.getElementById(SCRIPT_ID)
    existingScript ? existingScript.replaceWith(script) : document.head.append(script)

    return () => {
      const existingScript = document.getElementById(SCRIPT_ID)
      existingScript?.remove()
    }
  }, [script])
}

import { useEffect, useState, useMemo, useCallback } from 'react'
import type { Theme } from 'context/themeContext'
import type { UseState } from 'superTypes'

type ScriptStatus = 'loading' | 'ready' | 'error'
type GrecaptchaScriptElement = HTMLScriptElement & { refCounter: number; onload: () => void }

type UseGrecaptchaProps = {
  sitekey: string
  onSuccess: (result: string) => void
  onExpire?: () => void
  onError?: () => void
  size?: 'normal' | 'compact'
  theme?: Theme
}

// eslint-disable-next-line max-lines-per-function
export const useGrecaptcha = ({
  sitekey,
  onSuccess,
  onExpire,
  onError,
  size = 'normal',
  theme = 'light'
}: Readonly<UseGrecaptchaProps>): ScriptStatus => {
  const [appendStatus, setAppendStatus]: UseState<ScriptStatus> = useState<ScriptStatus>('loading')

  const grecaptchas = useMemo(() => document.getElementsByClassName('g-recaptcha'), [])
  const onloadCallback = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    Array.from(grecaptchas).map(({ id }: Readonly<Element>) => {
      window.grecaptcha.render(id, {
        sitekey,
        callback: onSuccess,
        'expired-callback': onExpire,
        'error-callback': onError,
        size,
        theme
      })
    })
  }, [grecaptchas, onError, onExpire, onSuccess, sitekey, size, theme])

  window[onloadCallback] = onloadCallback

  const src = useMemo(
    () => `https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit`,
    []
  )

  const previousScript: GrecaptchaScriptElement | null = useMemo(
    () => document.querySelector(`script[src="${src}"]`),
    [src]
  )

  const script = useMemo(
    () =>
      Object.assign(document.createElement('script'), {
        async: true,
        defer: true,
        src: src,
        refCounter: 0
      }),
    [onloadCallback, src]
  )

  const handleNodeLoad = useCallback(() => {
    setAppendStatus('ready')
  }, [])

  const handleNodeError = useCallback(() => {
    setAppendStatus('error')
  }, [])

  useEffect(() => {
    if (previousScript) {
      setAppendStatus('ready')
    } else {
      console.log('appending node')
      script.addEventListener('load', handleNodeLoad)
      script.addEventListener('error', handleNodeError)
    }
    document.head.append(script)

    return () => {
      if (previousScript && previousScript.refCounter > 1) {
        script.removeEventListener('load', handleNodeLoad)
        script.removeEventListener('error', handleNodeError)
        script.remove()
      }
    }
  }, [handleNodeError, handleNodeLoad, previousScript, script])

  return appendStatus
}

import { useEffect, useState, useMemo, useCallback } from 'react'
import type { UseState } from 'superTypes'

type ScriptStatus = 'loading' | 'ready' | 'error'
type GrecaptchaScriptElement = HTMLScriptElement & { refCounter: number }

// eslint-disable-next-line max-lines-per-function
export const useGrecaptcha = (): ScriptStatus => {
  const [appendStatus, setAppendStatus]: UseState<ScriptStatus> = useState<ScriptStatus>('loading')

  const src = useMemo(() => 'https://www.google.com/recaptcha/api.js', [])

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
    [src]
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
      // implicit script targets the first element with 'g-recaptcha' in className
      // Put this append outside if else statement to append a script for every widget
      document.head.append(script)
      script.addEventListener('load', handleNodeLoad)
      script.addEventListener('error', handleNodeError)
    }

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

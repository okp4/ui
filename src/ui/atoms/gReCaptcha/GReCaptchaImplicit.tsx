import React, { useEffect, useMemo } from 'react'
import type { FC } from 'react'
import type { Theme } from 'context/themeContext'
import { uuid } from 'short-uuid'
import { useGrecaptcha } from 'hook/useGrecaptchaImplicit'

type GReCaptchaProps = {
  siteKey: string
  onSuccess: (result: string) => void
  onExpire?: (m: string) => void
  onError?: (m: string) => void
  size?: 'normal' | 'compact'
  theme?: Theme
}

export const GReCaptcha: FC<GReCaptchaProps> = ({
  siteKey,
  onSuccess,
  theme = 'light',
  size = 'normal',
  onError,
  onExpire
}: Readonly<GReCaptchaProps>) => {
  const handleSuccessCallbackId = useMemo(() => uuid(), [])
  const handleErrorCallbackId = useMemo(() => uuid(), [])
  const handleExpireCallbackId = useMemo(() => uuid(), [])

  // eslint please remove warning
  window[handleSuccessCallbackId] = onSuccess
  if (onError) window[handleErrorCallbackId] = onError
  if (onExpire) window[handleExpireCallbackId] = onExpire
  // eslint re-enable warning

  const scriptStatus = useGrecaptcha()

  useEffect(() => {
    console.log(scriptStatus)
  }, [scriptStatus])

  return (
    <div
      className="g-recaptcha"
      data-callback={handleSuccessCallbackId}
      data-error-callback={handleErrorCallbackId}
      data-expired-callback={handleExpireCallbackId}
      data-sitekey={siteKey}
      data-size={size}
      data-theme={theme}
    />
  )
}

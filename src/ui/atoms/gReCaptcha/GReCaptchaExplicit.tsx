import React, { useEffect, useMemo } from 'react'
import type { FC } from 'react'
import type { Theme } from 'context/themeContext'
import { uuid } from 'short-uuid'
import { useGrecaptcha } from 'hook/useGrecaptchaExplicit'

type GReCaptchaProps = {
  sitekey: string
  onSuccess: (result: string) => void
  onExpire?: () => void
  onError?: () => void
  size?: 'normal' | 'compact'
  theme?: Theme
}

export const GReCaptcha: FC<GReCaptchaProps> = ({
  sitekey,
  onSuccess,
  theme = 'light',
  size = 'normal',
  onError,
  onExpire
}: Readonly<GReCaptchaProps>) => {
  const handleSuccessCallbackId = useMemo(() => uuid(), [])
  const handleErrorCallbackId = useMemo(() => uuid(), [])
  const handleExpireCallbackId = useMemo(() => uuid(), [])
  const id = useMemo(() => uuid(), [])

  window[handleSuccessCallbackId] = onSuccess
  if (onError) window[handleErrorCallbackId] = onError
  if (onExpire) window[handleExpireCallbackId] = onExpire

  const scriptStatus = useGrecaptcha({ sitekey, onSuccess, onExpire, onError, size, theme })

  useEffect(() => {
    console.log(scriptStatus)
  }, [scriptStatus])

  return <div className="g-recaptcha" id={id} />
}

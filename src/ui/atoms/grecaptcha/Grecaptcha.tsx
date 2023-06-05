import React, { useRef, useMemo, useEffect, useState } from 'react'
import type { FC } from 'react'
import type { ThemeContextType } from 'context/themeContext'
import { useGrecaptcha } from 'hook/useGrecaptcha'
import { useTheme } from 'hook/useTheme'
import type { UseState } from 'superTypes'
import { uuid } from 'short-uuid'

type WidgetSize = 'normal' | 'compact'

type GReCaptchaProps = {
  sitekey: string
  onSuccess: (result: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark'
}

export const GReCaptcha: FC<GReCaptchaProps> = ({
  sitekey,
  onSuccess,
  onError,
  onExpire,
  theme
}: Readonly<GReCaptchaProps>) => {
  const { theme: contextTheme }: ThemeContextType = useTheme()
  const componentRef = useRef<HTMLDivElement>(null)
  const [widgetsize, setWidgetSize]: UseState<WidgetSize> = useState<WidgetSize>('normal')
  const id = useMemo(() => uuid(), [])
  const onSuccessCallbackId = useMemo(() => uuid(), [])
  const onExpireCallbackId = useMemo(() => uuid(), [])
  const onErrorCallbackId = useMemo(() => uuid(), [])
  const NORMAL_WIDGET_WIDTH = 304

  Object.assign(window, {
    [onSuccessCallbackId]: onSuccess,
    [onExpireCallbackId]: onExpire,
    [onErrorCallbackId]: onError
  })

  useGrecaptcha()

  useEffect(() => {
    const parentWidth =
      componentRef.current?.parentElement?.getBoundingClientRect().width ?? Infinity

    parentWidth >= NORMAL_WIDGET_WIDTH ? setWidgetSize('normal') : setWidgetSize('compact')
  }, [])

  return (
    <div
      className="g-recaptcha"
      data-callback={onSuccessCallbackId}
      data-error-callback={onErrorCallbackId}
      data-expired-callback={onExpireCallbackId}
      data-sitekey={sitekey}
      data-size={widgetsize}
      data-theme={theme ?? contextTheme}
      id={id}
      ref={componentRef}
    />
  )
}

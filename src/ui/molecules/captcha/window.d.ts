declare global {
  interface Window {
    grecaptcha: Grecaptcha | undefined
    grecaptchaOnLoad: (() => void) | undefined
  }
}

export interface Grecaptcha {
  render: ((
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    container: Readonly<string | Element>,
    parameters: Readonly<GrecaptchaRenderParameters>
  ) => string) &
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    ((container: Readonly<string | Element>) => string)
}

declare interface GrecaptchaRenderParameters {
  sitekey: string
  theme?: 'light' | 'dark'
  size?: 'normal' | 'compact'
  callback?: (result: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

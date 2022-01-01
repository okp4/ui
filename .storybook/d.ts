declare module '*.png' {
  const value: any
  export = value
}

declare module '*.jpg' {
  const value: any
  export = value
}

declare module '*.scss' {
  const styles: { [className: string]: string }
  export = styles
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}

declare module '!!raw-loader!*' {
  const contents: string
  export = contents
}
declare module '*.png' {
  const value: never
  export = value
}

declare module '*.jpg' {
  const value: never
  export = value
}

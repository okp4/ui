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

declare module '*.svg' {
  import type { ReactElement, SVGProps } from 'react'
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const content: (props: SVGProps<SVGElement>) => ReactElement
  export default content
}

declare module '*.graphql' {
  import type { DocumentNode } from 'graphql'

  const value: DocumentNode
  export = value
}

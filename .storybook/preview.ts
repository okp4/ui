import prettier from 'prettier/standalone'
import prettierBabel from 'prettier/parser-babel'

export const parameters = {
  actions: {
    argTypesRegex: '^on[A-Z].*'
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    },
    expanded: true
  },
  layout: 'centered',
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Welcome', 'Philosophy', 'Atoms']
    }
  },
  previewTabs: {
    canvas: {
      hidden: true
    }
  },
  viewMode: 'docs',
  docs: {
    transformSource: (input: string) =>
      prettier.format(input, {
        parser: 'babel',
        plugins: [prettierBabel]
      })
  }
}

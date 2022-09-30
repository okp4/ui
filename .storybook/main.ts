// @ts-ignore
const path = require('path')
module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-postcss',
    '@storybook/preset-scss',
    '@storybook/addon-links',
    '@storybook/addon-essentials'
  ],
  features: {
    modernInlineRender: true
  },
  staticDirs: ['../public'],
  framework: '@storybook/react',
  // @ts-ignore
  webpackFinal: async (config, { configType }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      adapters: path.resolve(__dirname, '../src/adapters')
    }
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '..', 'src'),
      'node_modules'
    ]

    config.module.rules.push(
      {
        test: [/\.scss$/, /\.module.scss$/],
        loader: 'sass-loader',
        options: {
          sassOptions: {
            log: console.log(
              '\n\n\n\npath.resolve(__dirname, "src/sass/")',
              path.resolve(__dirname, '../src/')
            ),
            includePaths: [path.resolve(__dirname, 'src/')]
          }
        }
      },
      {
        test: [/\.frag$/, /\.vert$/],
        use: 'raw-loader'
      }
    )
    return config
  }
}

const path = require('path')

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/preset-scss',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve('./src'),
    ]

    config.module.rules.push(
      {
        test: [/\.scss$/, /\.module.scss$/],
        loader: 'sass-loader',
        options: {
          sassOptions: {
            // indentWidth: 4,
            log: console.log(
              '\n\n\n\npath.resolve(__dirname, "src/sass/")',
              path.resolve(__dirname, '../src/')
            ),
            includePaths: [path.resolve(__dirname, 'src/')],
          },
        },
      },
      {
        test: [/\.frag$/, /\.vert$/],
        use: 'raw-loader',
      }
    )

    return config
  },
}

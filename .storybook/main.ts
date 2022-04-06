const path = require('path')
const iconDirectoryPath = path.resolve(__dirname, '../src/assets/icons')
const logoDirectoryPath = path.resolve(__dirname, '../src/assets/logos')

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/preset-scss', '@storybook/addon-links', '@storybook/addon-essentials'],
  staticDirs: ['../public'],
  framework: '@storybook/react',
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [...(config.resolve.modules || []), path.resolve('./src')]

    const fileLoaderRule = config.module.rules.find(rule => rule.test.test('.svg'))
    fileLoaderRule.exclude = [logoDirectoryPath, iconDirectoryPath]

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
            includePaths: [path.resolve(__dirname, 'src/')]
          }
        }
      },
      {
        test: [/\.frag$/, /\.vert$/],
        use: 'raw-loader'
      },
      {
        test: /\.svg$/i,
        include: [logoDirectoryPath, iconDirectoryPath],
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              dimensions: false
            }
          }
        ]
      }
    )

    return config
  }
}

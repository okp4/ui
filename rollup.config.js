import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'
import svgr from '@svgr/rollup'
import analyze from 'rollup-plugin-analyzer'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import graphql from '@rollup/plugin-graphql'
import ts from 'rollup-plugin-ts'
import { builtinModules } from 'module'
import alias from '@rollup/plugin-alias'

import * as packageJson from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    alias({
      entries: [
        { find: 'domain', replacement: 'src/domain' },
        { find: 'eventBus', replacement: 'src/eventBus' },
        { find: 'ui', replacement: 'src/ui' },
        { find: 'context', replacement: 'src/context' },
        { find: 'hook', replacement: 'src/hook' },
        { find: 'adapters', replacement: 'src/adapters' },
        { find: 'utils', replacement: 'src/utils.ts' },
        { find: 'superTypes', replacement: 'src/superTypes.ts' }
      ]
    }),
    copy({
      targets: [
        {
          src: [
            'src/ui/styles/palette.scss',
            'src/ui/styles/themes.scss',
            'src/ui/styles/_exports.module.scss'
          ],
          dest: 'lib/scss'
        },
        { src: 'src/assets/images', dest: 'lib/assets' }
      ],
      verbose: true
    }),
    svgr({ dimensions: false }),
    json(),
    resolve({ preferBuiltins: true, mainFields: ['browser'] }),
    postcss(),
    graphql(),
    ts({
      transpiler: 'swc',
      browserslist: false,
      hook: {
        outputPath: (path, kind) => (kind === 'declaration' ? './lib/index.d.ts' : path)
      }
    }),
    terser(),
    analyze({ summaryOnly: true })
  ],
  external: [
    ...builtinModules,
    ...(packageJson.dependencies ? Object.keys(packageJson.dependencies) : []),
    ...(packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : []),
    ...(packageJson.peerDependencies ? Object.keys(packageJson.peerDependencies) : [])
  ]
}

import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'
import svgr from '@svgr/rollup'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import analyze from 'rollup-plugin-analyzer'
import { terser } from 'rollup-plugin-terser'

import * as packageJson from './package.json'

export default [
  {
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
      copy({
        targets: [
          { src: ['src/ui/styles/palette.scss', 'src/ui/styles/themes.scss'], dest: 'lib/scss' }
        ],
        verbose: true
      }),
      svgr(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss(),
      terser(),
      analyze({ summaryOnly: true })
    ]
  },
  {
    input: 'lib/types/src/index.d.ts',
    output: [{ file: 'lib/index.d.ts', format: 'esm' }],
    external: [/\.scss$/],
    plugins: [dts(), del({ hook: 'buildEnd', targets: './lib/types' })]
  }
]

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
import json from '@rollup/plugin-json'
import graphql from '@rollup/plugin-graphql'
import fs from 'fs'

import * as packageJson from './package.json'

const tsConfig = JSON.parse(fs.readFileSync(__dirname + '/tsconfig.json', 'utf8'))

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
          {
            src: [
              'src/ui/styles/palette.scss',
              'src/ui/styles/themes.scss',
              'src/ui/styles/urls.scss',
              'src/ui/styles/_exports.module.scss'
            ],
            dest: 'lib/scss'
          }
        ],
        verbose: true
      }),
      svgr({ dimensions: false }),
      resolve({ preferBuiltins: true, mainFields: ['browser'] }),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss(),
      graphql(),
      terser(),
      analyze({ summaryOnly: true })
    ]
  },
  {
    input: 'lib/types/src/index.d.ts',
    output: [{ file: 'lib/index.d.ts', format: 'esm' }],
    external: [/\.scss$/],
    plugins: [
      dts({
        compilerOptions: {
          baseUrl: '.',
          paths: tsConfig.compilerOptions.paths
        }
      }),
      del({ hook: 'buildEnd', targets: './lib/types' })
    ]
  }
]

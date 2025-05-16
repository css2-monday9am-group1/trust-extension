import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-css-only'
import replace from '@rollup/plugin-replace'

export default [
  {
    input: 'src/content-script/index.ts',
    output: { file: 'dist/content-script.js' },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    input: 'src/popup/index.tsx',
    output: { file: 'dist/popup.js' },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production'), preventAssignment: true }),
      css({ output: 'popup.css' })
    ],
    onLog(level, log, handler) {
      if (log.code === 'CIRCULAR_DEPENDENCY') return
      handler(level, log)
    }
  }
]

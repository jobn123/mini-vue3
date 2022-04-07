import typescript from '@rollup/plugin-typescript';
import pkg from './package.json'

export default {
  input: './src/index.ts',
  output: [{
      format: 'cjs',
      file: pkg.main,
    },
    {
      format: 'es',
      file: pkg.module,
    },
    // {
    //   format: 'iife',
    //   file: './lib/min-vue3.iife.js',
    // }
  ],
  plugins: [typescript()]
};
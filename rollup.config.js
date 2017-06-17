import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import css from 'rollup-plugin-css-only'

export default {
  entry: './index.js',
  dest: 'dist/bundle.js',
  format: 'iife',
  context: 'this',
  sourceMap: true,
  plugins: [
    css({
      output: 'dist/bundle.css'
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json']
    }),
    commonjs(),
    buble(),
    uglify()
  ]
};

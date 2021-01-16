import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import { copySync, removeSync } from 'fs-extra'
import getConfig from '@roxi/routify/lib/utils/config'
import { mdsvex } from 'mdsvex'
import slug from 'remark-slug'

const { distDir } = getConfig() // use Routify's distDir for SSOT
const assetsDir = 'assets'
const buildDir = `dist/build`
const production = !process.env.ROLLUP_WATCH

// clear previous builds
removeSync(distDir)
removeSync(buildDir)

const copyToDist = () => ({
  writeBundle() {
    copySync(assetsDir, distDir)
  },
})

export default {
  preserveEntrySignatures: false,
  input: [`src/main.js`],
  output: {
    sourcemap: true,
    format: 'esm',
    dir: buildDir,
    chunkFileNames: `[name]${(production && '-[hash]') || ''}.js`,
  },
  plugins: [
    svelte({
      dev: !production,
      preprocess: [
        mdsvex({
          remarkPlugins: [slug],
          layout: {
            blog: 'src/components/Card.svelte',
          },
          extension: 'md',
        }),
      ],
      extensions: ['.md', '.svelte'],
    }),
    resolve({
      browser: 'true',
      dedupe: 'importee => !!importee.match(/svelte(/|$)/)',
    }),
    commonjs(),
    production && terser(),
    !production && livereload(distDir), // refresh entire window when code is updated,
    production && copyToDist(),
  ],
  watch: {
    clearScreen: false,
  },
}

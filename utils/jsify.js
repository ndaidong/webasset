// jsify.js

import esbuild from 'esbuild'
import beautify from 'js-beautify'

import { minifyJS } from './minifier.js'

const opt = {
  platform: 'browser',
  target: 'esnext',
  format: 'esm',
  legalComments: 'none',
  minify: false,
  write: false,
}

export const transform = async (rawjs, isLive = false) => {
  const output = await esbuild.transform(rawjs, opt)
  const { code } = output
  return isLive ? minifyJS(code) : beautify.js(code, { indent_size: 2 })
}

export const transformFile = async (fpath, isLive = false) => {
  const output = await esbuild.build({
    entryPoints: [fpath],
    bundle: true,
    treeShaking: true,
    ...opt,
  })
  const code = output?.outputFiles[0]?.text || ''
  return isLive ? minifyJS(code) : beautify.js(code, { indent_size: 2 })
}

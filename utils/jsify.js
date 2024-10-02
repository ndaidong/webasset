// jsify.js

import esbuild from 'esbuild'

import { minifyJS } from './minifier.js'

import { writeFileAsync } from './pathery.js'

import { debug } from './logger.js'

export const minify = async (js) => {
  return minifyJS(js)
}

const transform = async (input) => {
  const output = await esbuild.build({
    entryPoints: [input],
    bundle: true,
    platform: 'browser',
    target: 'esnext',
    format: 'esm',
    legalComments: 'none',
    minify: true,
    write: false,
    treeShaking: true,
  })
  const code = output?.outputFiles[0]?.text || ''
  return code
}

export const jsify = async (fpath) => {
  debug(`Processing JS file ${fpath}`)
  const content = await transform(fpath)
  debug(`Finish processing JS file ${fpath}`)
  return content
}

export const build = async (fpath, tpath) => {
  debug(`Processing JS file ${fpath}`)
  const code = await jsify(fpath)
  await writeFileAsync(tpath, code)
  debug(`Finish processing JS file ${fpath} to ${tpath}`)
  return code
}

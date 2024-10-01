// jsify.js

import esbuild from 'esbuild'
import swc from '@swc/core'

import { writeFileAsync } from './pathery.js'

import { debug } from './logger.js'

export const minify = async (js) => {
  const result = await swc.minify(js, {
    sourceMap: false,
    module: true,
    format: {
      comments: false,
      ecma: 5,
      quote_style: 1,
      semicolons: false,
    },
  })
  return result?.code || ''
}

const transform = async (input) => {
  const output = await esbuild.build({
    entryPoints: [input],
    bundle: true,
    platform: 'browser',
    target: 'esnext',
    format: 'esm',
    legalComments: 'none',
    minify: false,
    write: false,
  })
  const code = output?.outputFiles[0]?.text || ''
  return minify(code)
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

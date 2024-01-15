// jsify.js

import esbuild from 'esbuild'
import { minify as jmin } from 'terser'

import { debug } from './logger.js'

const buildToFile = async (fromPath, toPath) => {
  const output = await esbuild.buildSync({
    entryPoints: [fromPath],
    outfile: toPath,
    bundle: true,
    platform: 'browser',
    target: 'esnext',
    format: 'esm',
    pure: ['console.log', 'debug', 'alert'],
    legalComments: 'none',
    sourcemap: true,
    minify: true,
  })
  return output.code
}

export const build = async (fpath, tpath) => {
  debug(`Processing JS file ${fpath}`)
  await buildToFile(fpath, tpath)
  debug(`Finish processing JS file ${fpath} to ${tpath}`)
}

export const minify = async (js) => {
  const result = await jmin(js, {
    sourceMap: false,
    format: {
      comments: false,
      ecma: 5,
      quote_style: 1,
      semicolons: false,
    },
  })
  return result.code
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
  return output.outputFiles[0].text
}

export const jsify = async (fpath) => {
  debug(`Processing JS file ${fpath}`)
  const content = await transform(fpath)
  debug(`Finish processing JS file ${fpath}`)
  return content
}

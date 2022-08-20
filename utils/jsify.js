// jsify.js

import esbuild from 'esbuild'

import { debug } from './logger.js'

const buildToFile = async (fromPath, toPath) => {
  const output = await esbuild.buildSync({
    entryPoints: [fromPath],
    outfile: toPath,
    bundle: true,
    platform: 'node',
    target: 'esnext',
    format: 'esm',
    pure: ['console.log', 'debug', 'alert'],
    legalComments: 'none',
    sourcemap: true,
    minify: true
  })
  return output.code
}

export const build = async (fpath, tpath) => {
  debug(`Processing JS file ${fpath}`)
  await buildToFile(fpath, tpath)
  debug(`Finish processing JS file ${fpath} to ${tpath}`)
}

const transform = async (input) => {
  const output = await esbuild.build({
    entryPoints: [input],
    bundle: true,
    target: 'esnext',
    format: 'esm',
    legalComments: 'none',
    minify: false,
    write: false
  })
  return output.outputFiles[0].text
}

export const jsify = async (fpath) => {
  debug(`Processing JS file ${fpath}`)
  const content = await transform(fpath)
  debug(`Finish processing JS file ${fpath}`)
  return content
}

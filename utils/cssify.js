// cssify.js

import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import atimport from 'postcss-import'
import postcssNesting from 'postcss-nesting'

import { minifyCSS } from './minifier.js'

import { debug } from './logger.js'

import { readFileAsync, writeFileAsync } from './pathery.js'

const POSTCSS_PLUGINS = [
  atimport,
  autoprefixer,
  postcssNesting,
]

const buildToFile = async (rawcss, fpath, tpath) => {
  const plugins = [...POSTCSS_PLUGINS]

  const output = await postcss(plugins).process(rawcss, {
    from: fpath,
    to: tpath,
    map: true,
  })

  const css = minifyCSS(output.css)
  await writeFileAsync(tpath, css)
}

export const build = async (fpath, tpath) => {
  debug(`Processing CSS file ${fpath}`)
  const rawCSS = await readFileAsync(fpath)
  await buildToFile(rawCSS, fpath, tpath)
  debug(`Finish processing CSS file ${fpath} to ${tpath}`)
}

const transform = async (rawcss, fpath) => {
  const plugins = [...POSTCSS_PLUGINS]
  const output = await postcss(plugins).process(rawcss, {
    from: fpath,
    map: false,
  })

  const css = minifyCSS(output.css)

  return css
}

export const cssify = async (fpath) => {
  debug(`Processing CSS file ${fpath}`)
  const rawCSS = await readFileAsync(fpath)
  const content = await transform(rawCSS, fpath)
  debug(`Finish processing CSS file ${fpath}`)
  return content
}

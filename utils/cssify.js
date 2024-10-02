// cssify.js

import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import atimport from 'postcss-import'
import postcssNesting from 'postcss-nesting'

import beautify from 'js-beautify'

import { minifyCSS } from './minifier.js'

import { debug } from './logger.js'

import { readFileAsync } from './pathery.js'

const POSTCSS_PLUGINS = [
  atimport,
  autoprefixer,
  postcssNesting,
]

export const transform = async (rawcss, fpath, isLive = false) => {
  const plugins = [...POSTCSS_PLUGINS]
  const output = await postcss(plugins).process(rawcss, {
    from: fpath,
    map: false,
  })
  const { css } = output
  return isLive ? minifyCSS(css) : beautify.css(css, { indent_size: 2 })
}

export const transformFile = async (fpath, isLive = false) => {
  debug(`Processing CSS file ${fpath}`)
  const rawCSS = await readFileAsync(fpath)
  const content = await transform(rawCSS, fpath, isLive)
  debug(`Finish processing CSS file ${fpath}`)
  return content
}

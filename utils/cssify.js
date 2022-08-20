// cssify.js

import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import atimport from 'postcss-import'

import CleanCSS from 'clean-css'
import stripCssComments from 'strip-css-comments'

import { debug } from './logger.js'

import { readFileAsync, writeFileAsync } from './pathery.js'

const POSTCSS_PLUGINS = [
  atimport,
  autoprefixer
]

const removeComments = (css) => {
  return stripCssComments(css, {
    preserve: false
  })
}

const buildToFile = async (rawcss, fpath, tpath) => {
  const plugins = [...POSTCSS_PLUGINS]

  const output = await postcss(plugins).process(rawcss, {
    from: fpath,
    to: tpath,
    map: true
  })

  const minOpt = {
    level: 2,
    format: 'beautify'
  }
  const cleaner = new CleanCSS(minOpt)
  const cleanedCSS = await cleaner.minify(output.css)

  const { styles } = cleanedCSS

  const css = removeComments(styles)
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
    map: false
  })

  const minOpt = {
    level: 2,
    format: 'beautify'
  }
  const cleaner = new CleanCSS(minOpt)
  const cleanedCSS = await cleaner.minify(output.css)

  const { styles } = cleanedCSS

  return styles
}

export const cssify = async (fpath) => {
  debug(`Processing CSS file ${fpath}`)
  const rawCSS = await readFileAsync(fpath)
  const content = await transform(rawCSS, fpath)
  debug(`Finish processing CSS file ${fpath}`)
  return content
}

// htmlify.js
import { clone } from 'bellajs'
import nunjucks from 'nunjucks'
import pretty from 'pretti'
import { minify as htmlmin } from 'html-minifier-terser'
import { DOMParser } from 'linkedom'

import { debug, error } from './logger.js'

import { readFileAsync, isAbsoluteURL } from './pathery.js'

const state = {}

const minify = async (html = '') => {
  const minifiedHtml = await htmlmin(html, {
    useShortDoctype: true,
    decodeEntities: true,
    minifyCSS: false,
    minifyJS: false,
    removeComments: true,
    removeEmptyElements: false,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    conservativeCollapse: false,
    removeTagWhitespace: false
  })
  return minifiedHtml
}

const prettify = (html) => {
  return pretty(html, { ocd: true })
}

const normalize = (html, revision = '') => {
  const document = new DOMParser().parseFromString(html, 'text/html')

  const cssLinks = []
  document.querySelectorAll('link[rel="stylesheet"]').forEach((elm) => {
    const href = elm.getAttribute('href') || ''
    if (href && !isAbsoluteURL(href)) {
      cssLinks.push(href)
      elm.parentNode.removeChild(elm)
    }
  })
  const head = document.querySelector('head')
  cssLinks.forEach((href) => {
    const fpath = href + '?rev=' + revision
    const styleTag = document.createElement('link')
    styleTag.setAttribute('type', 'text/css')
    styleTag.setAttribute('href', fpath)
    styleTag.setAttribute('rel', 'stylesheet')
    head.appendChild(styleTag)
  })

  const jsLinks = []
  document.querySelectorAll('script').forEach((elm) => {
    const href = elm.getAttribute('src') || ''
    const type = elm.getAttribute('type') || ''
    const defer = elm.getAttribute('defer') || ''
    const xasync = elm.getAttribute('async') || ''
    if (href && !isAbsoluteURL(href)) {
      jsLinks.push({
        href,
        type,
        defer,
        xasync
      })
      elm.parentNode.removeChild(elm)
    }
  })
  const body = document.querySelector('body')
  jsLinks.forEach(({ href, type, defer, xasync }) => {
    const fpath = href + '?rev=' + revision
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('src', fpath)
    if (type) {
      scriptTag.setAttribute('type', type)
    }
    if (xasync) {
      scriptTag.setAttribute('async')
    }
    if (defer) {
      scriptTag.setAttribute('defer')
    }
    body.appendChild(scriptTag)
  })
  const output = Array.from(document.children).map(it => it.outerHTML).join('')
  return output ? '<!DOCTYPE html>' + output : ''
}

const parse = (njk, data = {}) => {
  return new Promise((resolve) => {
    state.engine.renderString(njk, data, (err, html) => {
      if (err) {
        error('Error while rendering string with nunjucks')
        error(err.message)
        return resolve('')
      }
      return resolve(html || '')
    })
  })
}

export const htmlify = async (tplFile, data = {}, isLive = false) => {
  const fpath = `${state.tplDir}/${tplFile}`
  debug(`Start processing HTML file ${fpath}`)
  const njk = await readFileAsync(fpath)
  const rawHtml = await parse(njk, {
    ...state.data,
    ...data
  })
  const html = normalize(rawHtml, state.data.REVISION)
  const output = isLive ? await minify(html) : prettify(html)
  debug(`Finish processing HTML file ${fpath}`)
  return output
}

export const setup = (tplDir, config, defaultData = {}) => {
  state.engine = nunjucks.configure(tplDir, config)
  state.tplDir = tplDir
  state.data = defaultData
}

export const getState = () => {
  return clone(state)
}

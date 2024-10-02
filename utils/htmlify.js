// htmlify.js

import { clone, unique } from 'bellajs'
import nunjucks from 'nunjucks'
import pretty from 'pretti'
import { DOMParser } from 'linkedom'

import { minifyHtml } from './minifier.js'

import { readFileAsync, isAbsoluteURL } from './pathery.js'

import { debug, error } from './logger.js'

const state = {}

const prettify = (html) => {
  return pretty(html, { ocd: true })
}

export const domify = (html) => {
  return new DOMParser().parseFromString(html, 'text/html')
}

const normalize = (html, revision = '') => {
  const document = domify(html)

  const cssGroup = []
  const cssLinks = []
  document.querySelectorAll('link[rel="stylesheet"]').forEach((elm) => {
    const href = elm.getAttribute('href') || ''
    const group = elm.getAttribute('group') || ''
    if (group) {
      cssGroup.push(group)
    } else if (href && !isAbsoluteURL(href)) {
      cssLinks.push(href)
    }
    elm.parentNode.removeChild(elm)
  })
  const head = document.querySelector('head')

  unique(cssGroup).forEach((groupName) => {
    const fpath = `/css/${groupName}.css?rev=${revision}`
    const styleTag = document.createElement('link')
    styleTag.setAttribute('type', 'text/css')
    styleTag.setAttribute('href', fpath)
    styleTag.setAttribute('rel', 'stylesheet')
    head.appendChild(styleTag)
  })
  unique(cssLinks).forEach((href) => {
    const fpath = href + '?rev=' + revision
    const styleTag = document.createElement('link')
    styleTag.setAttribute('type', 'text/css')
    styleTag.setAttribute('href', fpath)
    styleTag.setAttribute('rel', 'stylesheet')
    head.appendChild(styleTag)
  })

  const jsGroup = []
  const jsLinks = []
  document.querySelectorAll('script').map((elm) => {
    const href = elm.getAttribute('src') || ''
    return {
      href,
      elm,
    }
  }).filter(({ href }) => {
    return href !== '' && !isAbsoluteURL(href)
  }).forEach((item) => {
    const {
      href,
      elm,
    } = item
    const type = elm.getAttribute('type') || ''
    const defer = elm.getAttribute('defer') || ''
    const xasync = elm.getAttribute('async') || ''
    const group = elm.getAttribute('group') || ''
    if (group) {
      jsGroup.push(group)
    } else {
      jsLinks.push({
        href,
        type,
        defer,
        xasync,
      })
    }
    elm.parentNode.removeChild(elm)
  })
  const body = document.querySelector('body')

  unique(jsGroup).forEach((groupName) => {
    const scriptTag = document.createElement('script')
    scriptTag.setAttribute('src', `/js/${groupName}.js?rev=${revision}`)
    body.appendChild(scriptTag)
  })

  unique(jsLinks).forEach(({ href, type, defer, xasync }) => {
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
    ...data,
  })
  const html = normalize(rawHtml, state.data.REVISION)
  const output = isLive ? minifyHtml(html) : prettify(html)
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

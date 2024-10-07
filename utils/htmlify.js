// htmlify.js

import { clone, unique } from 'bellajs'
import nunjucks from 'nunjucks'
import { DOMParser } from 'linkedom'
import beautify from 'js-beautify'

import { minifyHtml } from './minifier.js'

import { readFileAsync, isAbsoluteURL } from './pathery.js'

import { debug, error } from './logger.js'

const state = {}

export const prettify = (html) => {
  return beautify.html(html, { indent_size: 2 })
}

export const domify = (html) => {
  return new DOMParser().parseFromString(html, 'text/html')
}

const normalize = (html, revision = '') => {
  const doc = domify(html)

  const cssGroup = []
  const cssLinks = []

  doc.querySelectorAll('link[rel="stylesheet"]').map((elm) => {
    const href = elm.getAttribute('href') || ''
    const type = elm.getAttribute('type') || ''
    const rel = elm.getAttribute('rel') || ''
    const group = elm.getAttribute('group') || ''
    return {
      href,
      type,
      rel,
      group,
      elm,
    }
  }).filter(({ href }) => {
    return href !== '' && !isAbsoluteURL(href)
  }).forEach((linkItem) => {
    const {
      href,
      group,
      elm,
    } = linkItem
    if (group) {
      cssGroup.push(group)
    } else if (href) {
      cssLinks.push(href)
    }
    elm.parentNode.removeChild(elm)
  })

  const head = doc.querySelector('head')

  unique(cssGroup).forEach((groupName) => {
    const fpath = `/css/${groupName}.css?rev=${revision}`
    const styleTag = doc.createElement('link')
    styleTag.setAttribute('type', 'text/css')
    styleTag.setAttribute('href', fpath)
    styleTag.setAttribute('rel', 'stylesheet')
    head.appendChild(styleTag)
  })
  unique(cssLinks).forEach((href) => {
    const fpath = href + '?rev=' + revision
    const styleTag = doc.createElement('link')
    styleTag.setAttribute('type', 'text/css')
    styleTag.setAttribute('href', fpath)
    styleTag.setAttribute('rel', 'stylesheet')
    head.appendChild(styleTag)
  })

  const jsGroup = []
  const jsLinks = []
  doc.querySelectorAll('script').map((elm) => {
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
  const body = doc.querySelector('body')

  unique(jsGroup).forEach((groupName) => {
    const scriptTag = doc.createElement('script')
    scriptTag.setAttribute('src', `/js/${groupName}.js?rev=${revision}`)
    body.appendChild(scriptTag)
  })

  unique(jsLinks).forEach(({ href, type, defer, xasync }) => {
    const fpath = href + '?rev=' + revision
    const scriptTag = doc.createElement('script')
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

  const output = Array.from(doc.children).map(it => it.outerHTML).join('')
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

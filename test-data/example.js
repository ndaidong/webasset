// libs / dom.js

export { genid } from 'bellajs'

const isString = (val) => {
  return String(val) === val
}

const isElement = (v) => {
  return {}.toString.call(v).match(/^\[object HTML\w*Element]$/) !== null
}

export const onReady = (fn) => {
  const rt = document.readyState
  const c = rt !== 'loading'
  return c ? setTimeout(fn, 0) : document.addEventListener('DOMContentLoaded', fn)
}

export const getElement = (elmid) => {
  return isString(elmid) ? document.getElementById(elmid) : elmid
}

export const createElement = (tagName) => {
  return isString(tagName) ? document.createElement(tagName.toUpperCase()) : null
}

export const insertElement = (tag, root, before) => {
  const node = isElement(tag) ? tag : createElement(tag)
  const parent = !root ? document.body : getElement(root)
  const beforeNode = before === 0 ? root.firstChild : getElement(before)
  return parent.insertBefore(node, beforeNode)
}

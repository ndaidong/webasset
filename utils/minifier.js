// minifier.js

import { config, string } from '@tdewolff/minify'

config({
  'css-precision': 0,
  'html-keep-comments': false,
  'html-keep-conditional-comments': false,
  'html-keep-default-attr-vals': false,
  'html-keep-document-tags': false,
  'html-keep-end-tags': false,
  'html-keep-whitespace': false,
  'html-keep-quotes': false,
  'js-precision': 0,
  'js-keep-var-names': false,
  'js-version': 0,
  'json-precision': 0,
  'json-keep-numbers': false,
  'svg-keep-comments': false,
  'svg-precision': 0,
  'xml-keep-whitespace': false,
})

export const minifyHtml = (raw) => {
  return string('text/html', raw)
}

export const minifyJS = (raw) => {
  return string('text/javascript', raw)
}

export const minifyCSS = (raw) => {
  return string('text/css', raw)
}

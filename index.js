// index.js

export { minifyJS as jsminify, minifyCSS as cssminify } from './utils/minifier.js'

export { transform as jsify, transformFile as jsbuild } from './utils/jsify.js'
export { transform as cssify, transformFile as cssbuild } from './utils/cssify.js'
export { setup, htmlify, domify, prettify } from './utils/htmlify.js'

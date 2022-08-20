// utils / pathery

import {
  existsSync,
  readdirSync,
  writeFile,
  promises
} from 'fs'

export const isAbsoluteURL = (file = '') => {
  const f = String(file)
  return f.startsWith('http') || f.startsWith('//')
}

export const readFileAsync = async (f) => {
  if (!existsSync(f)) {
    return ''
  }
  const content = await promises.readFile(f, 'utf8')
  return content || ''
}

export const writeFileAsync = (f, content) => {
  return new Promise((resolve, reject) => {
    writeFile(f, content, 'utf8', (err) => {
      return err ? reject(err) : resolve(true)
    })
  })
}

export { existsSync, readdirSync }

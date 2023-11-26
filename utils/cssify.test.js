// cssify.test.js
/* eslint-env jest */

import {
  existsSync,
  readFileSync
} from 'fs'

import { build, cssify } from './cssify.js'

describe('Validate cssify methods', () => {
  const sampleFile = './test-data/example.css'
  const outputFile = 'dist/example.css'
  test(`Check if ${outputFile} was built`, async () => {
    await build(sampleFile, outputFile)
    expect(existsSync(outputFile)).toBeTruthy()
    const transformed = readFileSync(outputFile, 'utf8')
    const outlen = transformed.split('\n').length
    expect(outlen <= 2).toBeTruthy()
  })
  test('Check if transformation works', async () => {
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = await cssify(sampleFile)
    expect(transformed === original).toBeFalsy()
  })
})

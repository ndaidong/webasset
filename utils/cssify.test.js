// cssify.test.js
/* eslint-env jest */

import {
  existsSync,
  readFileSync
} from 'fs'

import { build, cssify } from './cssify.js'

describe('Validate cssify methods', () => {
  const sampleFile = './test-data/example.css'
  const baseFile = './test-data/example.base.css'
  const outputFile = 'dist/example.css'
  test(`Check if ${outputFile} was built`, async () => {
    await build(sampleFile, outputFile)
    expect(existsSync(outputFile)).toBeTruthy()
    const original = readFileSync(sampleFile, 'utf8')
    const base = readFileSync(baseFile, 'utf8')
    const transformed = readFileSync(outputFile, 'utf8')
    const orglen = original.split('\n').length + base.split('\n').length
    const outlen = transformed.split('\n').length
    expect(Math.abs(orglen - outlen) <= 5).toBeTruthy()
  })
  test('Check if transformation works', async () => {
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = await cssify(sampleFile)
    expect(transformed === original).toBeFalsy()
  })
})

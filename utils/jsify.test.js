// jsify.test.js
/* eslint-env jest */

import {
  existsSync,
  readFileSync
} from 'fs'

import { build, jsify } from './jsify.js'

describe('Validate jsify methods', () => {
  const sampleFile = './test-data/example.js'
  const outputFile = 'dist/example.js'
  build(sampleFile, outputFile)
  test(`Check if ${outputFile} was built`, () => {
    expect(existsSync(outputFile)).toBeTruthy()
    expect(existsSync(outputFile + '.map')).toBeTruthy()
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = readFileSync(outputFile, 'utf8')
    expect(transformed.split('\n').length < original.split('\n').length).toBeTruthy()
  })
  test('Check if transformation works', async () => {
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = await jsify(sampleFile)
    expect(transformed === original).toBeFalsy()
  })
})

// jsify.test.js

import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  existsSync,
  readFileSync,
  writeFileSync
} from 'node:fs'

import { build, jsify, minify } from './jsify.js'

describe('Validate jsify methods', async () => {
  const sampleFile = './test-data/example.js'
  const outputFile = 'dist/example.js'
  await build(sampleFile, outputFile)
  it(`Check if ${outputFile} was built`, () => {
    assert.equal(existsSync(outputFile), true)
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = readFileSync(outputFile, 'utf8')
    assert.notEqual(transformed.split('\n').length, original.split('\n').length)
  })
  it('Check if transformation works', async () => {
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = await jsify(sampleFile)
    assert.notEqual(transformed, original)
  })
  it('Check if minification works', async () => {
    const original = readFileSync(sampleFile, 'utf8')
    const minified = await minify(original)
    writeFileSync('dist/example.min.js', minified, 'utf8')
    assert.notEqual(minified, original)
  })
})

// cssify.test.js

import {
  existsSync,
  readFileSync
} from 'node:fs'

import { describe, it } from 'node:test'
import assert from 'node:assert'

import { build, cssify } from './cssify.js'

describe('Validate cssify methods', () => {
  const sampleFile = './test-data/example.css'
  const outputFile = 'dist/example.css'
  it(`Check if ${outputFile} was built`, async () => {
    await build(sampleFile, outputFile)
    assert.equal(existsSync(outputFile), true)
    const transformed = readFileSync(outputFile, 'utf8')
    const outlen = transformed.split('\n').length
    assert.equal(outlen <= 30, true)
  })
  it('Check if transformation works', async () => {
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = await cssify(sampleFile)
    assert.notEqual(transformed, original)
  })
})

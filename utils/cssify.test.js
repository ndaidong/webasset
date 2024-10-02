// cssify.test.js

import {
  readFileSync,
  writeFileSync
} from 'node:fs'

import { describe, it } from 'node:test'
import assert from 'node:assert'

import { transformFile } from './cssify.js'

describe('Validate transformFile methods', () => {
  const sampleFile = './test-data/example.css'
  const outputFile = 'dist/example.css'
  it('Check if transformation works', async () => {
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = await transformFile(sampleFile)
    writeFileSync(outputFile, transformed)
    assert.notEqual(transformed, original)
  })
})

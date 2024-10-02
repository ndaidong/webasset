// jsify.test.js

import { describe, it } from 'node:test'
import assert from 'node:assert'

import {
  readFileSync,
  writeFileSync
} from 'node:fs'

import { transformFile } from './jsify.js'

describe('Validate transformFile methods', async () => {
  const sampleFile = './test-data/example.js'
  const outputFile = 'dist/example.js'
  it('Check if transformation works', async () => {
    const original = readFileSync(sampleFile, 'utf8')
    const transformed = await transformFile(sampleFile)
    writeFileSync(outputFile, transformed)
    assert.notEqual(transformed, original)
  })
})

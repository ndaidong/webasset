// htmlify.test.js

import { describe, it } from 'node:test'
import assert from 'node:assert'

import { setup, getState, htmlify } from './htmlify.js'

describe('Validate htmlify methods', () => {
  it('Check if setup/getState', () => {
    const data = {
      name: 'webasset',
      REVISION: '12345678',
    }
    setup('test-data/views', {}, data)
    const state = getState()
    assert.equal(state.data.name, data.name)
  })

  it('Check rendering html from template', async () => {
    const data = {
      pageTitle: 'Hello webasset',
      siteName: 'webasset',
    }
    const html = await htmlify('index.html', data)
    assert.equal(html.includes(data.pageTitle), true)
    assert.equal(html.includes(data.siteName), true)
    assert.equal(html.includes('12345678'), true)

    const liveHtml = await htmlify('index.html', data, true)
    assert.equal(liveHtml.includes(data.pageTitle), true)
    assert.equal(liveHtml.includes(data.siteName), true)
    assert.equal(liveHtml.includes('12345678'), true)
    assert.equal(liveHtml.length < html.length, true)

    const wrongFileHtml = await htmlify('somepage.html', data)
    assert.equal(wrongFileHtml, '')

    const errorFileHtml = await htmlify('errorpage.html', data)
    assert.equal(errorFileHtml, '')
  })
})

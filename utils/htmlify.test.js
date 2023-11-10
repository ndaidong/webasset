// htmlify.test.js
/* eslint-env jest */

import { setup, getState, htmlify } from './htmlify.js'

describe('Validate htmlify methods', () => {
  test('Check if setup/getState', () => {
    const data = {
      name: 'webasset',
      REVISION: '12345678',
    }
    setup('test-data/views', {}, data)
    const state = getState()
    expect(state.data.name === data.name).toBeTruthy()
  })

  test('Check rendering html from template', async () => {
    const data = {
      pageTitle: 'Hello webasset',
      siteName: 'webasset',
    }
    const html = await htmlify('index.html', data)
    expect(html.includes(data.pageTitle)).toBeTruthy()
    expect(html.includes(data.siteName)).toBeTruthy()
    expect(html.includes('12345678')).toBeTruthy()

    const liveHtml = await htmlify('index.html', data, true)
    expect(liveHtml.includes(data.pageTitle)).toBeTruthy()
    expect(liveHtml.includes(data.siteName)).toBeTruthy()
    expect(liveHtml.includes('12345678')).toBeTruthy()
    expect(liveHtml.length < html.length).toBeTruthy()

    const wrongFileHtml = await htmlify('somepage.html', data)
    expect(wrongFileHtml === '').toBeTruthy()

    const errorFileHtml = await htmlify('errorpage.html', data)
    expect(errorFileHtml === '').toBeTruthy()
  })
})

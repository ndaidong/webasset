// logger

import { logger as nonalog } from 'nonalog'

const { env = {} } = process

const enableLog = env.ENABLE_WEBASSET_LOG || 'yes'

export const logger = nonalog('webrun', {
  enable: enableLog === 'yes'
})

export const debug = logger.debug
export const error = logger.error

/**
 * @type {Record<'info'|'warn'|'error'|'debug', (...msg: any[]) => void>}
 */
export const logger = {
  // @ts-ignore
  log(level, ...msg) {
    console.log(`[${level}]`, ...msg)
  }
};

// @ts-ignore
for (const level of ['info', 'warn', 'error', 'debug']) logger[level] = logger.log.bind(null, level)

export default logger
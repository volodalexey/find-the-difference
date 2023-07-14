function debug(name) {
  const enabled = Boolean((localStorage.getItem('debug') ?? '').includes(name));
  function logger(...params) {
    if (enabled) {
      console.log(name, ...params)
    }
  }
  logger.enabled = enabled;
  return logger;
}

export const logApp = debug('ftdiff-app')
export const logLayout = debug('ftdiff-layout')
export const logLoader = debug('ftdiff-loader')
export const logKeyCode = debug('ftdiff-key-code')
export const logMoveInterface = debug('ftdiff-move-ui')
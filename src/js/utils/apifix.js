define(['utils/env', 'config/config'], (getEnv, getConfig) => {
  let getAPIfix = () => {
    let env = getEnv()
    switch (env) {
      case 'develop': {
        return getConfig('APIDevPrefix')
      }
      case 'testing': {
        return getConfig('APITestPrefix')
      }
      case 'prerelease': {
        return getConfig('APIPrePrefix')
      }
      default: {
        return getConfig('APIPrefix')
      }
    }
  }
  return getAPIfix
})

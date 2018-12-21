define(['utils/env'], (getEnv) => {
  let config = {
    APIDevPrefix: '', // 开发环境
    APITestPrefix: '', // 测试环境
    APIPrePrefix: 'http://hwcsp.cn:7089/api/', // 预发布环境
    APIPrefix: '', // 线上环境
    imgHost: { // 图片地址
      develop: '',
      testing: '',
      prerelease: '',
      production: ''
    },
    mock: {
      upload: 0,
      login: 0,
      register: 0
    }
  }
  let getConfig = (key) => {
    if (typeof config[key] === 'object' && config[key].production) {
      let env = getEnv()
      return config[key] && config[key][env] ? config[key][env] : config[key].production
    }
    return config[key]
  }
  return getConfig
})

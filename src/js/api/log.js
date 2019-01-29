define(['config/config', 'api/index'], (globalConfig, ajaxApi) => {
  let apiConfig = {
    mockLog: '../../json/log.json'
  }
  let api = {}
  api.logConfig = (config) => {
    return ajaxApi.createConfig(apiConfig.mockLog)
  }
  return api
})

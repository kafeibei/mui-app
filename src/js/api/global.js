define(['config/config', 'api/index'], (globalConfig, ajaxApi) => {
  var apiConfig = {
    mockLocation: '../../json/location.json'
  }
  var api = {}
  api.pageConfig = (url) => {
    return ajaxApi.createConfig(url)
  }
  api.locationConfig = (config) => {
    return api.pageConfig(apiConfig.mockLocation)
  }
  return api
})

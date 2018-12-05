define(['config/config', 'api/index'], (globalConfig, ajaxApi) => {
  var apiConfig = {
    alldic: 'base/alldic', // 字典配置
    address: 'http://www.***.com/static/json/address.json', // 模拟地址信息
    mockaddress: '',
    mockLocation: '../../json/location.json'
  }
  var api = {}
  api.pageConfig = (url) => {
    return ajaxApi.createConfig(url)
  }
  api.addressConfig = (config) => {
    return api.pageConfig(config.mock ? apiConfig.mockaddress : apiConfig.address)
  }

  api.locationConfig = (config) => {
    return api.pageConfig(apiConfig.mockLocation)
  }
  return api
})

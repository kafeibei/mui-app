define(['api/index'], (ajaxApi) => {
  let apiConfig = {
    userLogin: '/cspAccount/login'
  }
  let api = {}
  api.login = (config) => {
    return ajaxApi.createAPI(apiConfig.userLogin, 'post', config)
  }
  return api
})

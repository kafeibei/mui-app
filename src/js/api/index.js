define(['mui', 'utils/headers', 'utils/muiview', 'utils/userinfo', 'utils/utils', 'config/router', 'utils/apifix'], function(mui, renderHeaders, muiview, userinfo, utils, defineRouter, getAPIfix) {
  let api = {}
  api.getUrl = (url) => {
    return getAPIfix() + url
  }
  api.createAPI = (url, method, config = {}) => {
    return new Promise((resolve, reject) => {
      let defineHeaders = renderHeaders()
      if (method !== 'get') {
        defineHeaders['Content-Type'] = 'application/json'
      }
      let params = {
        dataType: 'JSON',
        type: method || 'get',
        headers: defineHeaders,
        timeout: 60000,
        success: (data) => {
          if (typeof data === 'string') {
            data = JSON.parse(data)
          }
          if (data.code === '400') {
            if (muiview.curHref().indexOf('login') === -1) {
              userinfo.removeUserInfo()
              muiview.openWebview(defineRouter.login)
              muiview.loading.close()
              return {}
            }
          } else if (data.code && data.code !== '100') {
            let rej = {
              error_code: 'AJAX_ERROR',
              error_message: data.message || '接口访问错误啦',
              status: data.code,
              data: data.data || data
            }
            return reject(rej)
          } else {
            return resolve(data.data || data)
          }
        },
        error: (error) => {
          let data = error.response || error
          let rej
          if (data.message) {
            rej = {
              error_code: data.error,
              error_message: data.status === 500 ? '您的操作太快了，小易需要休息一下，请您稍后再试' : data.message,
              status: data.status
            }
          } else {
            rej = {
              error_code: 'AJAX_ERROR',
              error_message: '接口访问错误啦~',
              status: 500
            }
          }
          return reject(rej)
        }
      }
      if (config.data) {
        params.data = config.data
      }
      let ajaxUrl = api.getUrl(url)
      if (config.params) {
        ajaxUrl += '?' + utils.codeParam(config.params)
      }
      return mui.ajax(ajaxUrl, params)
    })
  }
  api.createMock = (url) => {
    return new Promise((resolve, reject) => {
      let ajaxUrl = 'https://www.easy-mock.com/mock/5bd13b15b36f2c5eac3a91ec/app/' + url
      return mui.ajax(ajaxUrl, {
        success: (data) => {
          return resolve(data.data || data)
        },
        error: (rej) => {
          return reject(rej)
        }
      })
    })
  }
  api.createConfig = (url) => {
    return new Promise((resolve, reject) => {
      return mui.ajax(url, {
        success: (data) => {
          if (typeof data === 'string') {
            data = JSON.parse(data)
          }
          return resolve(data.data || data)
        },
        error: (rej) => {
          return reject(rej)
        }
      })
    })
  }
  return api
})

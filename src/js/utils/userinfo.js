define(['utils/storage'], (storage) => {
  let userinfo = {}
  userinfo.getUserInfo = (key) => {
    let userInfo = storage.get('userInfo') || {}
    if (key) {
      return userInfo[key] || ''
    }
    return userInfo || ''
  }

  userinfo.setUserInfo = (data) => {
    storage.set('userInfo', data, data.validPeriod ? data.validPeriod - 5 : null)
  }

  userinfo.removeUserInfo = () => {
    storage.remove('userInfo')
  }

  userinfo.checkUserInfo = () => {
    let token = userinfo.getUserInfo('token')
    return token
  }

  userinfo.removeKeywordList = () => {
    storage.remove('keywordList')
  }

  return userinfo
})

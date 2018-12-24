define(['md5', 'config/config', 'utils/utils', 'utils/userinfo'], (md5, getConfig, utils, userinfo) => {
  let renderHeaders = () => {
    var userInfo = userinfo.getUserInfo()
    let defineHeader = {}
    if (userInfo && userInfo.token) {
      defineHeader.token = userInfo.token
    }
    let codeparams = utils.codeParam(defineHeader)
    let configHeader = {}
    for (let i in defineHeader) {
      configHeader[i] = defineHeader[i]
    }
    return configHeader
  }
  return renderHeaders
})

define(['md5', 'config/config', 'utils/utils', 'utils/userinfo'], (md5, getConfig, utils, userinfo) => {
  let renderHeaders = () => {
    var userInfo = userinfo.getUserInfo()
    let defineHeader = {}
    userInfo.token = 'd6BujuOlPssEB+1J1pbdBmOEGwEEagly90NoTbS6c/S1BjlVX245xJ7c/H/Y6J71gCzzwu4b/ZepVSRWjQbufg=='
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

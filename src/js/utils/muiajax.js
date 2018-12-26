define(['utils/muiview', 'utils/headers', 'api/index', 'api/link'], (muiview, renderHeaders, ajaxApi, api) => {
  let muiajax = (e, key, cbk) => {
    muiview.loading.show()
    let uploadUrl = ajaxApi.getUrl(api.uploadFile)
    if (!muiview.osplus()) {
      setTimeout(() => {
        muiview.loading.close()
        cbk && cbk(1, 'http://demo.dcloud.net.cn/test/audio/apple.mp3')
      }, 1000)
    } else {
      let task = plus.uploader.createUpload(uploadUrl, {
        method: 'POST'
      }, (t, status) => { // 上传完成
        muiview.loading.close()
        if (status === 200) {
          let res = JSON.parse(t.responseText)
          if(res.code === '100'){
            if (res.data && res.data[0]) {
              let localUrl = 'http://172.25.50.201:8080/api/'
              let curUrl = 'http://hwcsp.cn:7089/api/'
              let portrait = res.data[0].portrait
              if (portrait.indexOf(localUrl) > -1) {
                portrait = portrait.replace(localUrl, curUrl)
              }
              cbk && cbk(1, portrait)
            } else {
              cbk && cbk(-1, '资源返回错误')
            }
          } else {
            cbk && cbk(-1, res.message)
          }
        } else {
          cbk && cbk(-1, '上传失败')
        }
        muiview.loading.close()
      }, (rej) => {
        muiview.loading.close()
        console.error('rej', rej)
      })
      let defineHeaders = renderHeaders()
      for (let key in defineHeaders) {
        task.setRequestHeader(key, defineHeaders[key])
      }
      // 添加其他参数
      task.addFile(e, {
        key: 'files'
      })
      task.start()
    }
  }
  return muiajax
})

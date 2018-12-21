define(['utils/muiview', 'utils/headers', 'api/index', 'api/link'], (muiview, renderHeaders, ajaxApi, api) => {
  let upload = {}
  upload.choose = (key, cbk) => {
    let uploadType = [{
      title: '拍照'
    }, {
      title: '选择照片'
    }]
    if (!muiview.osplus()) {
      cbk && cbk(1, {
        name: '测试图片呀',
        url: 'http://www.seendio.com/static/img/video.29828cb.png'
      })
    } else {
      plus.nativeUI.actionSheet({
        cancel: '取消',
        buttons: uploadType
      }, (e) => {
        switch (e.index) {
          case 1: { // 拍照
            upload.byCamera(key, cbk)
            break
          }
          case 2: { // 从相册中选择
            upload.byGallery(key, cbk)
            break
          }
          default: {
            console.info(e.index)
          }
        }
      })
    }
  }
  upload.byCamera = (key, cbk) => {
    plus.camera.getCamera().captureImage((e) => {
      plus.io.resolveLocalFileSystemURL(e, (entry) => {
        upload.ajax(entry.toLocalURL(), key, cbk)
      }, (e) => {
        plus.nativeUI.toast('读取拍照文件错误：' + e.message)
      })
    }, (e) => {
      console.error(e)
    }, {
      filter: 'image',
      multiple: false,
      system: false
    })
  }
  upload.byGallery = (key, cbk) => {
    plus.gallery.pick((path) => {
      upload.ajax(path, key, cbk)
    }, (e) => {
      if (e.code === 8) {
        // 设置访问权限
        mui.alert('您可以在“隐私设置”中启用访问','此应用没有权限访问您的照片或视频', '好的')
      }
    }, {
      filter: 'image',
      multiple: false,
      system: false
    })
  }
  upload.ajax = (e, key, cbk) => {
    muiview.loading.show()
    let uploadUrl = ajaxApi.getUrl(api.uploadFile)
    let task = plus.uploader.createUpload(uploadUrl, {
      method: 'POST'
    }, (t, status) => { // 上传完成
      muiview.loading.close()
      if (status === 200) {
        let res = JSON.parse(t.responseText)
        if(res.code === '100'){
          if (res.data && res.data[0]) {
            cbk && cbk(1, {
              url: res.data[0].portrait
            })
          } else {
            cbk && cbk(-1, '图片返回错误')
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
    task.addData('uploadFileLocation', key || '')
    task.start()
  }
  return upload
})

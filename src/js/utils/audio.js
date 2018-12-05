define(['utils/muiview', 'utils/headers', 'api/index', 'api/link'], (muiview, renderHeaders, ajaxApi, api) => {
  let audio = {}
  audio.choose = (key, cbk) => {
    let uploadType = [{
      title: '录音'
    }, {
      title: '选择录音文件'
    }]
    if (!muiview.osplus()) {
      cbk && cbk(1, 'http://www.seendio.com/static/img/video.29828cb.png')
    } else {
      plus.nativeUI.actionSheet({
        cancel: '取消',
        buttons: uploadType
      }, (e) => {
        switch (e.index) {
          case 1: { // 拍照
            audio.byCamera(key, cbk)
            break
          }
          case 2: { // 从相册中选择
            audio.byGallery(key, cbk)
            break
          }
          default: {
            console.info(e.index)
          }
        }
      })
    }
  }
  audio.byCamera = (key, cbk) => {
    plus.camera.getCamera().captureImage((e) => {
      plus.io.resolveLocalFileSystemURL(e, (entry) => {
        audio.ajax(entry.toLocalURL(), key, cbk)
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
  audio.byGallery = (key, cbk) => {
    plus.gallery.pick((path) => {
      audio.ajax(path, key, cbk)
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
  audio.ajax = (e, key, cbk) => {
    muiview.loading.show()
    let uploadUrl = ajaxApi.getUrl(api.uploadFile)
    let task = plus.uploader.createUpload(uploadUrl, {
      method: 'POST'
    }, (t, status) => { // 上传完成
      muiview.loading.close()
      if (status === 200) {
        let res = JSON.parse(t.responseText)
        if(res.code === '100'){
          cbk && cbk(1, res.data)
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
    task.addData('uploadFileLocation', key || uploadLocation.base)
    task.start()
  }
  audio.play = (src, cbk) => {
    let audioObj
    if (!muiview.osplus()) {
      audioObj = audio.audioObj = new Audio()
      audioObj.src = src
      audioObj.play()
      audioObj.onerror = () => {
        cbk && cbk(-1)
      }
      audioObj.onloadedmetadata = () => {
        cbk && cbk(1)
      }
    } else {
      audioObj = audio.audioObj = plus.audio.createPlayer(src)
      console.log('src', src)
      audioObj.play(() => {
        console.log(1)
        cbk && cbk(1)
      }, (e) => {
        console.log(-1)
        cbk && cbk(-1, e.message)
      })
      setTimeout(() => {
        console.log(audioObj.getPosition())
      }, 1200)
    }
  }
  audio.stop = (cbk) => {
    audio.audioObj.pause()
    cbk && cbk(1)
  }
  audio.getPosition = (cbk) => {
    if (!muiview.osplus()) {
      audio.audioObj.ontimeupdate = () => {
        cbk && cbk(1, audio.audioObj.currentTime)
      }
    } else {

    }
  }
  return audio
})

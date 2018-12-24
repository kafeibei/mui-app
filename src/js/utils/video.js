define(['utils/muiview', 'utils/muiajax'], (muiview, muiajax) => {
  let video = {}
  video.choose = (key, cbk) => {
    let uploadType = [{
      title: '录像'
    }, {
      title: '选择视频文件'
    }]
    if (!muiview.osplus()) {
      cbk && cbk(0)
    } else {
      plus.nativeUI.actionSheet({
        cancel: '取消',
        buttons: uploadType
      }, (e) => {
        switch (e.index) {
          case 1: { // 录像
            video.byCamera(key, cbk)
            break
          }
          case 2: { // 选择视频文件
            video.byGallery(key, cbk)
            break
          }
          default: {
            console.info(e.index)
          }
        }
      })
    }
  }
  video.byCamera = (key, cbk) => {
    plus.camera.getCamera().startVideoCapture((e) => {
      plus.io.resolveLocalFileSystemURL(e, (entry) => {
        muiajax(entry.toLocalURL(), key, cbk)
      }, (e) => {
        plus.nativeUI.toast('读取录像文件错误：' + e.message)
      })
    })
  }
  video.byGallery = (key, cbk) => {
    plus.gallery.pick((path) => {
      muiajax(path, key, cbk)
    }, (e) => {
      if (e.code === 8) {
        // 设置访问权限
        mui.alert('您可以在“隐私设置”中启用访问', '此应用没有权限访问您的录像', '好的')
      }
    }, {
      filter: 'video',
      multiple: false,
      system: false
    })
  }
  video.play = (src, cbk) => {
    let videoObj
    if (!muiview.osplus()) {
      videoObj = video.videoObj = document.getElementById('videoDom')
      if (videoObj) {
        videoObj.play()
      }
    } else {
      videoObj = video.videoObj = new plus.video.VideoPlayer('videoDom', {
        src: src
      })
      videoObj.play()
      videoObj.requestFullScreen()
      videoObj.addEventListener('ended', () => {
    		videoObj.exitFullScreen()
    	}, false)
      videoObj.addEventListener('fullscreenchange', (event) => {
        if (event.detail && !event.detail.fullScreen) {
          videoObj.exitFullScreen()
        }
      })
      videoObj.addEventListener('error', (event) => {
        cbk && cbk(-1, '视频播放错误')
      })
      cbk && cbk(1)
    }
  }
  video.stop = (cbk) => {
    if (!muiview.osplus()) {
      video.videoObj.pause()
    } else {
      video.videoObj.exitFullScreen()
      video.videoObj.close()
    }
    cbk && cbk(1)
  }
  return video
})

define(['utils/muiview', 'utils/muiajax'], (muiview, muiajax) => {
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
        muiajax(entry.toLocalURL(), key, cbk)
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
      muiajax(path, key, cbk)
    }, (e) => {
      if (e.code === 8) {
        // 设置访问权限
        mui.alert('您可以在“隐私设置”中启用访问', '此应用没有权限访问您的照片', '好的')
      }
    }, {
      filter: 'image',
      multiple: false,
      system: false
    })
  }
  return upload
})

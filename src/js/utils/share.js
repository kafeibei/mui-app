define(['mui', 'utils/muiview', 'config/shareServices', 'utils/utils'], (mui, muiview, shareServices, utils) => {
  let share = {}
  // 获取分享服务列表
  share.getServices = (cbk) => {
    if (!muiview.osplus()) {
      cbk && cbk(servicesBack(shareServices))
    } else {
      plus.share.getServices((services) => {
        cbk && cbk(servicesBack(services))
      })
    }
    function servicesBack (services) {
      let shareServices = []
      if (services && services[0]) {
        let filterService = ['weixin']
        services.forEach(item => {
          if (filterService.indexOf(item.id) > -1) {
            if (item.id === 'weixin') {
              let wxScene = ['WXSceneSession', 'WXSceneTimeline']
              for (let i = 0, len = wxScene.length; i < len; i++) {
                let sceneItem = mui.extend({}, item)
                sceneItem.scene = wxScene[i]
                sceneItem.key = [sceneItem.id, sceneItem.scene].join('-')
                sceneItem.description = i > 0 ? '朋友圈' : '微信好友'
                shareServices.push(sceneItem)
              }
            } else {
              item.description += '好友'
              item.key = item.id
              shareServices.push(item)
            }
          }
        })
      }
      let shareExtra = [{
        id: 'copy',
      	description: '复制链接',
        key: 'copy',
      	authenticated: true,
      	nativeClient: false
      // }, {
      //   id: 'qrcode',
      // 	description: '二维码',
      //   key: 'qrcode',
      // 	authenticated: true,
      // 	nativeClient: false
      }]
      shareServices = shareServices.concat(shareExtra)
      return shareServices
    }
  }

  share.system = (params) => {
    console.log('haha')
    if (!muiview.osplus()) {
      // window.history.back()
    } else {
      if (plus.os.name.toLocaleLowerCase() === 'ios') {
        let NSURL = plus.ios.import('NSURL')
        let NSData = plus.ios.import('NSData')
        let UIImage = plus.ios.import('UIImage')
        let NSArray = plus.ios.import('NSMutableArray')
        let activityItems = NSArray.arrayWithCapacity(10)
        params.pictures.forEach(item => {
  				let imageUrl = NSURL.URLWithString(item)
  				let data = NSData.dataWithContentsOfURL(imageUrl)
  				let localImage = UIImage.imageWithData(data)
  				activityItems.addObject(localImage)
  			})
        let UIActivityViewController = plus.ios.importClass('UIActivityViewController')
  			let activityVC = new UIActivityViewController()
  			let activity = plus.ios.invoke(activityVC, 'initWithActivityItems:applicationActivities:', activityItems, null)
  			console.log('activity == ')
  			console.log(JSON.stringify(activity))
  			let UIApplicationClass = plus.ios.importClass('UIApplication')
  			let UIAppObj = UIApplicationClass.sharedApplication()
  			let del = plus.ios.invoke(UIAppObj, 'delegate')
  			let appWindowObj = plus.ios.invoke(del, 'window')
  			let appRootController = plus.ios.invoke(appWindowObj, 'rootViewController')

  			plus.ios.invoke(appRootController, 'presentViewController:animated:completion:', activity, 'YES', null)
      } else {
        let convertPic = []
        let paramsPicLen = params.pictures.length
        let onStateChanged = (file, status) => {
          switch (file.state) {
            case 4:
              if (status === 200) {
                convertPic.push(plus.io.convertLocalFileSystemURL(file.filename))
                paramsPicLen--
                if (paramsPicLen === 0) {
                  console.log('convertPic', convertPic)
                  share.weixinShare(convertPic, params.title)
                }
              } else {
                jumaoe.toast({
                  message: '下载图片失败'
                })
              }
              break
            default: {
              console.info('state: ' + file.state)
            }
          }
        }
        for (let i = 0; i < paramsPicLen; i++) {
          let dtask = plus.downloader.createDownload(params.pictures[i])
          dtask.addEventListener('statechanged', onStateChanged, false)
          dtask.start()
        }
      }
    }
  }

  share.weixinShare = (pictures, title) => {
    let intent = new Intent(Intent.ACTION_SEND_MULTIPLE)
		intent.setType("image/*")
		let localArrayList = new ArrayList()
		for(var i = 0; i < pictures.length; i++) {
			let filePath = pictures[i]
			localArrayList.add(Uri.fromFile(new File(filePath)))
		}
		intent.putParcelableArrayListExtra(Intent.EXTRA_STREAM, localArrayList)
		intent.putExtra(Intent.EXTRA_TEXT, title)
		intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
		intent.putExtra("Kdescription", title)
		main.startActivity(Intent.createChooser(intent, "系统分享"))
  }
  return share
})

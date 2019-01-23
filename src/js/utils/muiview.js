define(['mui', 'utils/utils', 'utils/storage'], (mui, utils, storage) => {
  let muiview = {}
  muiview.alert = (params) => {
    if (typeof params === 'string') {
      params.message = params
    }
    params.title = params.title || '提示通知'
    mui.alert(params.message, params.title, '知道了', (data) => {
      params.onClose && params.onClose()
    })
  }
  muiview.confirm = (params) => {
    if (typeof params === 'string') {
      params.message = params
    }
    params.title = params.title || '操作提示'
    mui.confirm(params.message, params.title, null, (data) => {
      params.onClose && params.onClose(data.index > 0)
    })
  }
  /*
  * toast 消息提示框
  */
  muiview.toast = (params) => {
    if (typeof params === 'string') {
      params.message = params
    }
    let short = 2000
    mui.toast(params.message || '操作成功',{ duration: params.duration || short})
    setTimeout(() => {
      params.onClose && params.onClose()
    }, params.duration || short)
  }
  /*
  * 获得plus
  */
  muiview.osplus = () => {
    return mui.os.plus
  }
  /*
  * 预览图片
  */
  muiview.previewImage = () => {
    // mui.previewImage()
    console.info('previewImage')
  }
  /*
  * 打开webview
  */
  muiview.openWebview = (opts) => {
    let options = mui.extend({
      id: '',  //当前页面id
      url: '',  // 目标页面idea
      styles: {},
      extras: {},
      createNew: false,
      show: { // 转场动画
        aniShow: 'slide-in-right'
      }
    }, opts)
    if (!muiview.osplus()) {
      let search = ''
      if (options.extras) {
        search = '?' + utils.codeParam(options.extras)
      }
      window.top.location.href = options.url + search
    } else {
      mui.plusReady(() => {
        let currentWebview = options.curId ? plus.webview.getWebviewById(options.curId) : plus.webview.currentWebview()
        mui.openWindow(options)
        let targetWebview = plus.webview.getWebviewById(options.id)
        if (targetWebview) {
          if (options.reload) {
            targetWebview.reload()
          }
          mui.fire(targetWebview, 'show', {})
        }
      })
    }
  }
  muiview.subWebview = (opts) => {
    let url = opts.url
    if (!muiview.osplus()) {
      let search = ''
      if (opts.extras) {
        search = (url.indexOf('?') > -1 ? '&' : '?') + utils.codeParam(opts.extras)
      }
      url += search
    }
    mui.init({
      subpages: [{
        url: url,
        id: opts.id,
        extras: opts.extras,
        styles: opts.styles
      }]
    })
  }
  muiview.webviewParams = (cbk) => {
    if (!muiview.osplus()) {
      let params = utils.getUrlParam()
      cbk && cbk(params)
    } else {
      mui.plusReady(() => {
        let params = plus.webview.currentWebview()
        cbk && cbk(params)
      })
    }
  }
  muiview.curHref = () => {
  	if (!muiview.osplus()) {
  		return window.location.href
  	} else {
  		return plus.webview.currentWebview().getURL()
  	}
  }
  // 纵向滚动
  muiview.scrollY = (target) => {
    mui(target).scroll({
      scrollY: true,
      scrollX: false,
      startX: 0,
      startY: 0,
      indicators: true,
      deceleration:0.0006,
      bounce: true
    })
  }
  // 横向滚动
  muiview.scrollX = (target, item) => {
    mui(target).scroll({
      scrollY: false,
      scrollX: true,
      indicators: false,
      stopPropagation: true,
      deceleration:0.0006,
      snap: item
    })
  }
  // 上拉刷新和下拉加载更多
  muiview.pullRefresh = (target, pullupRefresh, pulldownRefresh) => {
    let initRefresh = () => {
      let refreshParams = {
        container: target
      }
      if (pullupRefresh) {
        refreshParams.up = {
          contentrefresh: '正在加载...',
          contentnomore: '别扯啦，到底了',
          callback: pullupRefresh
        }
      }
      if (pulldownRefresh) {
        refreshParams.down = {
          height: 50,
          contentdown: '下拉可以刷新',
          contentover: '释放立即刷新',
          contentrefresh: '正在刷新...',
          callback: pulldownRefresh
        }
      }
      mui.init({
        pullRefresh: refreshParams
      })
    }
    if (!muiview.osplus()) {
      initRefresh()
    } else {
      mui.plusReady(() => {
        initRefresh()
      })
    }
  }
  muiview.loading = {
    waiting: null,
    show: () => {
      if (muiview.loading.isWaiting()) {
        return false
      }
      if (muiview.osplus()) {
        muiview.loading.waiting = plus.nativeUI.showWaiting()
      } else {
        let loadingdiv = document.createElement('span')
        loadingdiv.className = 'loading-container iconfont icon-loading'
        loadingdiv.id = 'loading-spinner'
        document.body.appendChild(loadingdiv)
        muiview.loading.waiting = loadingdiv
      }
    },
    isWaiting: () => {
      if (muiview.loading.waiting) {
        return true
      }
      return false
    },
    close: () => {
      if (muiview.loading.isWaiting()) {
        if (muiview.osplus()) {
          muiview.loading.waiting.close()
          muiview.loading.waiting = null
        } else {
          document.body.removeChild(muiview.loading.waiting)
          muiview.loading.waiting = null
        }
      }
    }
  }
  muiview.btnloading = {
    show: (event) => {
      let $this = mui(event.target)
      $this.button('loading')
    },
    close: (event) => {
      let $this = mui(event.target)
      $this.button('reset')
    }
  }
  muiview.webviewGroup = (key, params) => {
    if (!muiview.osplus()) {
      return {
        switchTab: (pageId, extras) => {
          if (window.frames && window.frames[0]) {
            let curHref = window.location.href.split('?')[0] + '?' + utils.codeParam(extras)
            window.location.href = curHref
          } else {
            params.items[0].extras = extras
            muiview.subWebview(params.items[0])
          }
        }
      }
    }
    return new webviewGroup(key, params)
  }
  muiview.webviewPage = (pageId, cbk) => {
    if (!muiview.osplus()) {
      cbk && cbk({})
    } else {
      mui.plusReady(() => {
        cbk && cbk(plus.webview.getWebviewById(pageId))
      })
    }
  }
  muiview.fire = (pageId, methods, data) => {
    if (muiview.osplus()) {
      mui.plusReady(() => {
        let webviewPage = plus.webview.getWebviewById(pageId)
        if (webviewPage) {
          mui.fire(webviewPage, methods, {
            data: data
          })
        }
      })
    } else {
      let params = {
        methods,
        pageId,
        data
      }
      if (pageId.indexOf('sub') > -1) {
        window.frames[0].postMessage(params, '*')
      } else {
        storage.set('pageParams', params)
      }
    }
  }

  // pageId 当前页面的pageId
  muiview.addEventListener = (methods, pageId, cbk) => {
    if (muiview.osplus()) {
      window.addEventListener(methods, (event) => {
        cbk && cbk(event.detail.data)
      })
    } else if (pageId.indexOf('sub') > -1) {
      window.addEventListener('message', (event) => {
        let data = event.data
        if (!data) {
          cbk && cbk()
          return
        }
        if (data.pageId === pageId && data.methods === methods) {
          cbk && cbk(data.data)
        }
      })
    } else {
      let pageParams = storage.get('pageParams')
      if (pageParams.methods === methods && pageParams.pageId === pageId) {
        cbk && cbk(pageParams.data)
      } else {
        cbk && cbk()
      }
    }
  }
  muiview.closeWebview = (pageId) => {
    if (muiview.osplus()) {
      mui.plusReady(() => {
        if (pageId) {
          let webviewPage = plus.webview.getWebviewById(pageId)
          if (webviewPage) {
            plus.webview.close(webviewPage, 'none')
          } else {
            console.error('pageId:' + pageId + '页面错误')
          }
        } else {
          let self = plus.webview.currentWebview()
          self.close()
        }
      })
    }
  }
  muiview.webviewMask = (pageId, styles) => {
    if (!muiview.osplus()) {

    } else {
      plus.webview.create('', pageId, styles).show()
    }
  }
  muiview.back = () => {
    if (!muiview.osplus()) {
      window.history.back()
    } else {
      mui.back()
    }
  }
  muiview.platform = () => {
    if (mui.os.android) {
      return 'android'
    } else if (mui.os.ios) {
      return 'ios'
    }
    return 'unknown'
  }
  muiview.copyToClip = (str) => {
    if (!muiview.osplus()) {
      console.info('复制的内容是', str)
    } else {
      if(muiview.platform() === 'ios') {
				let UIPasteboard = plus.ios.importClass('UIPasteboard')
				let generalPasteboard = UIPasteboard.generalPasteboard()
				generalPasteboard.setValueforPasteboardType(str, 'public.utf8-plain-text')
			} else {
				let Context = plus.android.importClass('android.content.Context')
				let main = plus.android.runtimeMainActivity()
				let clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
				plus.android.invoke(clip, 'setText', str)
			}
      muiview.toast({
        message: '复制成功'
      })
    }
  }
  muiview.closeSplashscreen = () => {
    if (!muiview.osplus()) {

    } else {
      plus.navigator.closeSplashscreen()
    }
  }
  muiview.setFullscreen = (type) => {
    if (!muiview.osplus()) {

    } else {
      plus.navigator.setFullscreen(type)
    }
  }
  return muiview
})

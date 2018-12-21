require(['vue', 'components/banner', 'utils/muiview', 'utils/storage', 'config/router', 'utils/userinfo'], (Vue, widgetBanner, muiview, storage, defineRouter, userinfo) => {
  widgetBanner()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        indicate: true,
        config: {
          loop: false,
          indicator: true,
          custom: true,
          interval: 0
        },
        data: []
      }
    },
    created () {
      this.initGuide()
      // storage.clear()
      let showGuide = storage.get('showGuide')
      if (showGuide) {
        muiview.closeSplashscreen()  // 关闭splash页面
        muiview.setFullscreen(false)
        this.doClose()
      } else {
        if(mui.os.ios) {
          muiview.setFullscreen(true)
        }
      }
    },
    methods: {
      initGuide () {
        this.data = [{
          title: '引导页第一张图',
          name: '1'
        }, {
          title: '引导页第二张图',
          name: '2'
        }, {
          title: '引导页第三张图',
          name: '3'
        }]
      },
      goLogin () {
        this.doClose()
        storage.set('showGuide', 1)
        setTimeout(function() {
  				muiview.setFullscreen(false)
  			}, 300)
      },
      doClose () {
        this.indicate = false
        let token = userinfo.getUserInfo('token')
        if (token) {
          muiview.openWebview(defineRouter.home)
        } else {
          muiview.openWebview(defineRouter.login)
        }
      }
    }
  })
})

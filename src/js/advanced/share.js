require(['vue', 'components/navBar', 'utils/utils', 'utils/muiview', 'utils/share', 'config/router'], (Vue, navBar, utils, muiview, share, defineRouter) => {
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '分享功能',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        }
      }
    },
    created () {
      this.addEventListener()
    },
    methods: {
      addEventListener () {
        window.addEventListener('closeMask', (event) => {
          muiview.webviewPage('mask', (webviewPage) => {
            webviewPage.close()
          })
        })
      },
      setShare () {
        share.system({
          pictures: ['https://kafeibei.github.io/raffle-h5/common/images/data/longines.png', 'https://kafeibei.github.io/raffle-h5/common/images/data/iphone.png'],
          title: '系统分享标题'
        })
      },
      defineShare () {
        muiview.openWebview({
          id: defineRouter.sharepopover.id,
          url: defineRouter.sharepopover.url,
          show: {
            aniShow: 'slide-in-bottom'
          },
          styles: {
  					background: 'transparent',
  				},
          extras: {
            shareTitle: '自定义分享标题',
            shareDescription: '自定义分享描述',
            shareImg: ['https://kafeibei.github.io/raffle-h5/common/images/data/longines.png'],
            link: 'http://www.baidu.com/',
            pageFrom: 'share'
          }
        })
        muiview.webviewMask('mask', {
          mask: 'rgba(0,0,0,0.4)',
    			background: 'transparent'
        })
      }
    }
  })
})

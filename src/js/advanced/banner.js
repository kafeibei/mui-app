require(['vue', 'components/navBar', 'components/banner', 'utils/utils', 'utils/muiview'], (Vue, navBar, widgetBanner, utils, muiview) => {
  navBar()
  widgetBanner()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '图片轮播',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        config: {
          loop: true,
          interval: 0,
          indicator: {
            direction: 'right'
          }
        },
        data: [{
          imgSrc: 'https://kafeibei.github.io/raffle-h5/common/images/guide/shake.png',
          title: '摇一摇'
        }, {
          imgSrc: 'https://kafeibei.github.io/raffle-h5/common/images/guide/slot.png',
          title: '老虎机'
        }, {
          imgSrc: 'https://kafeibei.github.io/raffle-h5/common/images/guide/scratch.png',
          title: '刮刮卡'
        }, {
          imgSrc: 'https://kafeibei.github.io/raffle-h5/common/images/guide/instant.png',
          title: '即时开奖'
        }]
      }
    }
  })
})

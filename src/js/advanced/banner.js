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
          imgSrc: 'http://pimg.xiuzan.com/xiuzan/2017/01/20170106173210_DWbPQD',
          title: '新春摇一摇'
        }, {
          imgSrc: 'http://pimg.xiuzan.com/xiuzan/2016/11/20161110155910_X5M2Kj',
          title: '轮盘夺宝'
        }, {
          imgSrc: 'http://pimg.xiuzan.com/xiuzan/2016/11/20161110155842_WmTdBd',
          title: '跑马灯'
        }, {
          imgSrc: 'http://xiuzan-pub.img-cn-beijing.aliyuncs.com/xiuzan/2016/8/GrTDma_dDYSJR_instant.jpg',
          title: '即时开奖'
        }]
      }
    }
  })
})

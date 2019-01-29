require(['vue', 'components/navBar', 'utils/utils', 'utils/muiview', 'config/router'], (Vue, navBar, utils, muiview, defineRouter) => {
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '下拉刷新和上拉加载',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        }
      }
    },
    created () {
      this.subView()
    },
    methods: {
      subView () {
        muiview.subWebview({
          url: defineRouter.subpullrefresh.url,
          id: defineRouter.subpullrefresh.id,
          styles: {
            top: utils.px2rem('76px'),
            bottom: 0
          }
        })
      }
    }
  })
})

require(['vue', 'components/navBar', 'components/bottomBar', 'utils/storage', 'utils/muiview', 'config/router'], (Vue, navBar, bottomBar, storage, muiview, defineRouter) => {
  navBar()
  bottomBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '我的',
        navBarConfig: {}
      }
    },
    methods: {
      goPage (type) {
        if (defineRouter[type]) {
          muiview.openWebview(defineRouter[type])
        } else {
          muiview.toast({
            message: '暂未配置该页面数据'
          })
        }
      },
      doEdit () {
        muiview.confirm({
          message: '确定要退出？',
          onClose: (code) => {
            if (code) {
              muiview.toast({
                message: '退出成功',
                onClose: () => {
                  storage.clear()
                  muiview.openWebview(defineRouter.login)
                }
              })
            }
          }
        })
      }
    }
  })
})

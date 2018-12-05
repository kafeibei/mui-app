require(['vue', 'mui', 'components/bottomBar', 'components/navBar', 'config/function', 'config/router', 'utils/muiview'], (Vue, mui, bottomBar, navBar, functions, defineRouter, muiview) => {
  bottomBar()
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '首页',
        navBarConfig: {},
        functions: functions
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
      muiBack () {
        let first = null
        mui.back = () => {
          if (!first) {
            first = new Date().getTime()
            muiview.toast('再按一次退出系统!')
            setTimeout(() => {
              first = null
            }, 2000)
          } else {
            if (new Date().getTime() - first < 2000) {
              plus.runtime.quit()
            }
          }
        }
      }
    }
  })
})

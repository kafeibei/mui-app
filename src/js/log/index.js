require(['vue', 'components/navBar', 'components/bottomBar', 'components/widgetLoading', 'api/log'], (Vue, navBar, bottomBar, widgetLoading, api) => {
  navBar()
  bottomBar()
  widgetLoading()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '更新日志',
        navBarConfig: {},
        listItems: [],
        finish: false
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList () {
        setTimeout(() => {
          api.logConfig()
            .then(res => {
              if (res && res[0]) {
                this.listItems = res.reverse()
                this.finish = true
              }
            })
        }, 800)
      }
    }
  })
})

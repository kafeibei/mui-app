require(['vue', 'components/navBar', 'components/bottomBar', 'components/message', 'utils/storage', 'utils/muiview'], (Vue, navBar, bottomBar, hgMessage, storage, muiview) => {
  navBar()
  bottomBar()
  hgMessage()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '我的',
        navBarConfig: {}
      }
    },
    methods: {
      cleanStorage () {
        storage.clear()
        muiview.toast({
          message: '清除本地存储成功'
        })
      }
    }
  })
})

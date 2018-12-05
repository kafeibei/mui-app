require(['vue', 'components/navBar', 'components/bottomBar', 'components/message'], (Vue, navBar, bottomBar, hgMessage) => {
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
    }
  })
})

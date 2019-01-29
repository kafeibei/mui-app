require(['vue', 'components/navBar', 'components/message', 'utils/muiview'], (Vue, navBar, hgMessage, muiview) => {
  navBar()
  hgMessage()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '关于我们',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        version: ''
      }
    },
    created () {
      this.getVersion()
    },
    methods: {
      getVersion () {
        muiview.getVersion((code, version) => {
          if (code > 0) {
            this.version = version
          }
        })
      }
    }
  })
})

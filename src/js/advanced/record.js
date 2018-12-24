require(['vue', 'components/navBar', 'components/uploadAudio', 'utils/utils', 'utils/muiview', 'config/router'], (Vue, navBar, uploadAudio, utils, muiview, defineRouter) => {
  navBar()
  uploadAudio()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '录音',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        audioList: []
      }
    }
  })
})

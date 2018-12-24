require(['vue', 'components/navBar', 'components/uploadVideo', 'utils/utils', 'utils/muiview', 'config/router'], (Vue, navBar, uploadVideo, utils, muiview, defineRouter) => {
  navBar()
  uploadVideo()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '录像',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        videoList: []
      }
    }
  })
})

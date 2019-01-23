require(['vue', 'components/navBar', 'components/uploadVideo', 'utils/utils', 'utils/muiview'], (Vue, navBar, uploadVideo, utils, muiview) => {
  navBar()
  uploadVideo()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '视频播放',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        videoList: [
          {
            src: 'http://vjs.zencdn.net/v/oceans.mp4'
          },
          {
            src: 'http://hwcsp.cn:7089/files/1547608280867.mp4'
          }
        ]
      }
    }
  })
})

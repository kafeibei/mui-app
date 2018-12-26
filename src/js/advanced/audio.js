require(['vue', 'components/navBar', 'components/uploadAudio', 'utils/utils', 'utils/muiview'], (Vue, navBar, uploadAudio, utils, muiview) => {
  navBar()
  uploadAudio()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '语音播放',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        audioList: [
          {
            src: 'http://hwcsp.cn:7089/api/file/contract/1545722604368.amr'
          },
          {
            src: 'http://demo.dcloud.net.cn/test/audio/apple.mp3'
          }
        ]
      }
    }
  })
})

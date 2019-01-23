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
            src: 'http://www.w3school.com.cn/i/horse.ogg'
          },
          {
            src: 'http://demo.dcloud.net.cn/test/audio/apple.mp3'
          },
          {
            src: 'http://hwcsp.cn:7089/files/1547566535525.wav'
          }
        ]
      }
    }
  })
})

require(['vue', 'components/navBar', 'components/widgetLoading', 'utils/utils', 'utils/muiview', 'utils/audio', 'config/router'], (Vue, navBar, widgetLoading, utils, muiview, audio, defineRouter) => {
  navBar()
  widgetLoading()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '音频选择',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          },
          right: {
            title: '确定',
            action: this.doSubmit
          }
        },
        finish: false,
        errorcode: '',
        listItems: [],
        curAudio: {},
        curIndex: -1,
        pageFrom: ''
      }
    },
    created () {
      muiview.webviewParams(params => {
        this.pageFrom = params.pageFrom
      })
      this.directory()
    },
    methods: {
      directory () {
        audio.directory('audio', (code, data) => {
          if (data && data[0]) {
            this.listItems = data
            this.errorcode = ''
          } else {
            this.listItems = []
            this.errorcode = '暂无可选择的录音文件~'
            this.navBarConfig.right.title = '返回'
          }
          this.finish = true
        })
      },
      chooseAudio (item, index) {
        this.curAudio = item
        this.curIndex = index
      },
      doSubmit () {
        if (!this.listItems || !this.listItems[0]) {
          this.closeSheet()
          return false
        }
        if (!this.curAudio.name) {
          muiview.toast({
            message: '请先选择音频文件'
          })
          return false
        }
        this.closeSheet(this.curAudio)
      },
      closeSheet (curAudio) {
        if (!curAudio) {
          muiview.back()
          return false
        }
        muiview.fire(defineRouter[this.pageFrom].id, 'fireAudioChoose', curAudio)
        muiview.back()
      },
      cleanHistory () {
        muiview.confirm({
          message: '确定要清除所有的录音文件？不可逆操作，请慎重',
          onClose: (code) => {
            if (code) {
              audio.cleanHistory(code => {
                let message
                if (code > 0) {
                  message = '清除所有录音文件成功'
                } else {
                  message = '清除所有录音文件失败'
                }
                muiview.toast({
                  message: message,
                  onClose: () => {
                    if (code > 0) {
                      this.finish = false
                      this.errorcode = ''
                      this.directory()
                    }
                  }
                })
              })
            }
          }
        })
      }
    }
  })
})

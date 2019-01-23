require(['vue', 'qrcode', 'utils/muiview', 'config/router', 'utils/share'], (Vue, qrcode, muiview, defineRouter, share) => {
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        model: 'share',
        title: '分享页',
        services: '',
        shareOpts: {},
        pageFrom: ''
      }
    },
    created () {
      muiview.webviewParams(params => {
        this.shareOpts.href = params.link
        this.shareOpts.title = params.shareTitle
        this.shareOpts.content = params.shareDescription
        this.shareOpts.thumbs = params.shareImg

        // var oQRCode = new QRCode("canvas", {
     	  //   text : this.shareOpts.href,
     	  //   width : 100,
     	  //   height : 100
     	  // })
        this.pageFrom = params.pageFrom
        this.getServices()
      })
    },
    methods: {
      getServices () {
        share.getServices((services) => {
          this.services = services
        })
      },
      doItem (item) {
        switch (item.id) {
          case 'copy': {
            muiview.copyToClip(this.shareOpts.href)
            break
          }
          case 'qrcode': {
            break
          }
          default: {
            this.goShare(item)
          }
        }
      },
      goShare (item) {
        if (item.scene) {
          this.shareOpts.extra = {
            scene: item.scene
          }
        } else {
          delete this.shareOpts.extra
        }
        if (item.send && item.send instanceof Function) {
          item.send(this.shareOpts, (res) => {
            muiview.toast({
              message: '分享成功',
              onClose: () => {
                this.goCancel()
              }
            })
          }, (rej) => {
            console.error('rej', JSON.stringify(rej))
            muiview.toast({
              message: rej.code === -2 ? '已取消分享' : '分享失败',
              onClose: () => {
                this.goCancel()
              }
            })
          })
        } else {
          muiview.toast({
            message: '不支持该种分享方式'
          })
        }
      },
      goCancel () {
        muiview.fire(defineRouter[this.pageFrom].id, 'closeMask')
        muiview.back()
      },
      closeMask (event) {
        if (event.target.className.indexOf('page-container') > -1) {
          this.goCancel()
        }
      }
    }
  })
})

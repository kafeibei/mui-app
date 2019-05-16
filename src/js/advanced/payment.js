require(['vue', 'components/navBar', 'global/components/hdpayView', 'utils/utils', 'utils/muiview', 'utils/payment', 'config/router', 'api/payment'], (Vue, navBar, hdpayView, utils, muiview, pay, defineRouter, api) => {
  navBar()
  hdpayView()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '支付功能',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        channels: [],
        cid: '2018092072921205923730',
        hdpayPopover: {
          id: 'hdpaysheet'
        }
      }
    },
    created () {
      pay.getChannels(channels => {
        this.channels = channels
      })
    },
    methods: {
      goPay (item) {
        if (muiview.loading.isWaiting()) {
          return false
        }
        muiview.loading.show()
        this.checkIsPayOff((code, message) => {
          if (code > 0) {   // 未支付
            this.thirdPay(item)
          } else {
            muiview.loading.close()
            console.error('订单查询是否支付:', message)
          }
        })
      },
      checkIsPayOff (cbk) {
        api.checkIsPayOff({
          data: {
            orderCode: this.cid
          }
        }).then((res) => {
          cbk && cbk(1)
        }, (rej) => {
          if (rej.status !== '202') {
            muiview.toast({
              message: rej.error_message,
              onClose: () => {
                cbk && cbk(-1, rej.error_message)
              }
            })
          } else {
            muiview.toast({
              message: '该订单已支付',
              onClose: () => {
                cbk && cbk(-1, '该订单已支付')
              }
            })
          }
        })
      },
      thirdPay (item) {
        if (item.id === 'hdpay') {
          mui('#' + this.hdpayPopover.id).popover('toggle')
          muiview.loading.close()
          return false
        }
        pay.allPay({
          channel: item,
          orderCode: this.cid,
          success: (res) => {
            if (this[item.id + 'Success']) {
              this[item.id + 'Success'](res)
            } else {
              console.warn('暂未提供' + item.id + '的回调方法')
            }
            muiview.loading.close()
          },
          fail: (rej) => {
            if (rej) {
              console.error('接口访问错误：' + (rej.message || rej.error_message))
              muiview.toast({
                message: rej.message || rej.error_message,
                onClose: () => {
                  muiview.loading.close()
                }
              })
            } else {
              muiview.loading.close()
            }
          }
        })
      },
      hdpayFinish () {
        this.goSuccess({
          cid: this.cid,
          type: 'hdpay'
        })
      },
      wxpaySuccess (res) {
        this.goSuccess({
          cid: this.cid,
          type: 'wxpay'
        })
      },
      offlineSuccess (res) {
        this.goSuccess({
          cid: this.cid,
          type: 'offline'
        })
      },
      wxh5paySuccess (res) {
        if (res && res.data) {
          let skipParam = {
            out_trade_no: '20180821235145455467008',
            type: 'wxpay'
          }
          window.location.href = window.location.origin + utils.setpathname(defineRouter.payskip.url) + '?' + utils.codeParam(skipParam)
          return false
          let params = {
            redirect_url: encodeURIComponent(window.location.origin + defineRouter.payskip.url)
          }
          let reDirect = res.data + (res.data.indexOf('?') > -1 ? '&' : '?') + utils.codeParam(params)
          window.location.href = reDirect
        }
      },
      goSuccess (extras) {
        muiview.openWebview({
          url: defineRouter.paysuccess.url,
          id: defineRouter.paysuccess.id,
          extras: extras
        })
      }
    }
  })
})

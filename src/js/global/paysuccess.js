require(['vue', 'components/navBar', 'components/widgetLoading', 'config/router', 'utils/muiview', 'api/payment'], (Vue, navBar, widgetLoading, defineRouter, muiview, api) => {
  navBar()
  widgetLoading()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '收银台',
        navBarConfig: {
          right: {
            title: '回到首页',
            action: this.goRouter
          }
        },
        payInfo: {},
        finish: false,
        cid: ''
      }
    },
    created () {
      muiview.webviewParams(params => {
        this.cid = params.cid
        this.type = params.type || 'alipay'
        this.payReturn()
      })
    },
    methods: {
      payReturn () {
        let params = {}
        if (this.type === 'alipay') {
          params.outTradeNo = this.cid
        } else if (this.type === 'wxpay') {
          params.orderCode = this.cid
        }
        if (api[this.type + 'Return']) {
          api[this.type + 'Return']({
            data: params
          }).then((res) => {
            this.finish = true
            if (res.tradeStatus === 'TRADE_SUCCESS') {
              this.payInfo = res
            } else {
              this.payInfo = {
                error_code: 'error',
                error_message: '请进入到订单列表中查看订单支付状态'
              }
            }
          }, (rej) => {
            console.error('接口访问错误：' + rej.error_message)
            this.finish = true
            this.payInfo = {
              error_code: rej.error_code,
              error_message: '请进入到订单列表中查看订单支付状态'
            }
          })
        } else {
          console.error('暂未提供该订单查询方法')
        }
      },
      goOrder (orderCode) {
        muiview.openWebview({
          url: defineRouter.orderdetail.url,
          id: defineRouter.orderdetail.id,
          extras: {
            orderCode: orderCode,
            type: 'waitdelivery'
          }
        })
      },
      goRouter () {
        muiview.openWebview(defineRouter.home)
      }
    }
  })
})

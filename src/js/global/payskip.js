require(['vue', 'utils/muiview','config/router', 'utils/utils'], (Vue, muiview, defineRouter, utils) => {
  let ddVue = new Vue({
    el: '#page-container',
    created() {
      let outTradeNo = utils.getUrlParam('out_trade_no')
      let payType = utils.getUrlParam('type') || 'alipay'
      if (outTradeNo) {
        muiview.openWebview({
          url: defineRouter.paysuccess.url,
          id: defineRouter.paysuccess.id,
          extras: {
            cid: outTradeNo,
            type: payType,
            key: 'outTradeNo'
          }
        })
      } else {
        muiview.toast({
          message: '回调参数错误'
        })
      }
    },
    methods: {

    }
  })
})

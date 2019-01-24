define(['api/index'], (ajaxApi) => {
  var apiConfig = {
    checkIsPayOff: 'payment/pay/checkIsPayOff', // 检测是否支付过
    alipay: 'payment/aliapppay/onPay', // 支付宝支付
    alih5pay: 'payment/alih5pay/onPay', // 支付宝h5支付
  	wxpay: 'payment/wxapppay/onPay', // 微信支付
    wxh5pay: 'payment/wxh5pay/onPay', // 微信h5支付
    offline: 'payment/offlinepay/onPay', // 线下支付
    allinpay: 'payment/allinpay/onPay', // 通联支付
    balancepay: 'payment/balancepay/onPay', // 余额支付
    shortmsgcode: 'finance/shortmsgcode', // 短信验证码
    alipayReturn: 'payment/aliapppay/callback/return',  // 阿里通过outTradeNo查询orderCode
    wxpayReturn: 'payment/wxapppay/callback/return'  // 微信查询
  }
  let api = {}
  api.checkIsPayOff = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
  }
  api.alipay = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
  }
  api.alih5pay = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
  }
  api.wxpay = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: 'rawdata'
        })
      }, 300)
    })
  }
  api.wxh5pay = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: 'rawdata'
        })
      }, 300)
    })
  }
  api.offline = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
  }
  api.balancepay = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
  }
  api.shortmsgcode = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({})
      }, 300)
    })
  }
  api.alipayReturn = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          tradeStatus: 'TRADE_SUCCESS',
          payAmount: '200',
          orderCode: '2018092072921205923730'
        })
      }, 300)
    })
  }
  api.wxpayReturn = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: {}
        })
      }, 300)
    })
  }
  api.hdpayReturn = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: {}
        })
      }, 300)
    })
  }
  api.offlineReturn = (config) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          data: {}
        })
      }, 300)
    })
  }
  return api
})

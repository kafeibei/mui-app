define(['mui', 'utils/muiview', 'utils/utils', 'config/payChannel', 'api/payment', 'config/router'], (mui, muiview, utils, payChannels, api, defineRouter) => {
  let pay = {}
  // 获取支付通道
  pay.getChannels = (cbk) => {
    if (!muiview.osplus()) {
      cbk && cbk(channelsBack(payChannels))
    } else {
      plus.payment.getChannels((channels) => {
        cbk && cbk(channelsBack(channels))
      })
    }
    function channelsBack(channels) {
      let payChannels = []
      if (channels && channels[0]) {
        channels.push({
          description: '余额',
          serviceReady: false,
          id: 'hdpay'
        }, {
          description: '线下',
          serviceReady: false,
          id: 'offline'
        })
        let filterPay = ['alih5pay', 'alipay', 'wxpay', 'wxh5pay', 'hdpay', 'offline']
        channels.forEach(item => {
          if (filterPay.indexOf(item.id) > -1) { // 过滤掉不支持的支付通道：暂不支持360相关支付
            item.title = item.description + '支付'
            item.isDisabled = false
            item.isDefault = false
            payChannels.push(item)
          }
        })
      }
      return payChannels
    }
  }
  // 检测是否安装支付服务
  pay.checkServices = (channel, success, fail) => {
    if (!channel.serviceReady) {
      let message = ''
      if (channel.id === 'alipay') {
        message = '检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？'
      } else {
        message = '系统未安装“' + channel.description + '”服务，无法完成支付，是否立即安装？'
      }
      if (!muiview.osplus()) {
        muiview.confirm({
          title: channel.title,
          message: message,
          onClose: (code) => {
            if (code) {
              success && success()
            } else {
              fail && fail()
            }
          }
        })
      } else {
        plus.nativeUI.confirm(message, (e) => {
          if (e.index === 0) {
            console.info('去appStore安装')
            success && success()
            channel.installService && channel.installService()
          } else {
            fail && fail()
          }
        }, channel.title)
      }
    } else {
      success && success()
    }
  }
  pay.allPay = (options) => {
    let params = {
      channel: '',
			orderCode: '',
			mobile: '',
			validcode: '',
			success: function() {},
			fail: function() {}
    }
    params = mui.extend(params, options)
    switch (params.channel.id) {
      case 'alipay':
      case 'wxpay': {
        pay.checkServices(params.channel, () => {
          muiview.loading.show()
          try {
  	        pay.apiPay(params, 'other')
          } catch (rej) {
            params.fail && params.fail(rej)
        		muiview.loading.close()
          }
        }, () => {
          params.fail && params.fail()
          muiview.loading.close()
        })
        break
      }
      case 'offline':
      case 'wxh5pay': {
        pay.apiPay(params, 'self')
        break
      }
      case 'alih5pay': {
        let skipParam = {
          out_trade_no: '20180821235145455467008',
        }
        window.location.href = window.location.origin + defineRouter.payskip.url + '?' + utils.codeParam(skipParam)
        return false
        let payParam = {
          orderCode: params.orderCode,
          return_url: window.location.origin + defineRouter.payskip.url
        }
        window.location.href = api.alih5pay() + '?' + utils.codeParam(payParam)
        break
      }
      default: {
        params.fail && params.fail({
          error_message: '当前环境不支持此支付通道！'
        })
      }
    }
  }
  pay.apiPay = (params, type) => {
    if (api[params.channel.id]) {
      api[params.channel.id]({
        data: {
          orderCode: params.orderCode
        }
      }).then(res => {
        if (type === 'other') {
          muiview.request(params, res, (code) => {
            muiview.loading.close()
          })
        } else {
          params.success && params.success(res)
          muiview.loading.close()
        }
      }).catch (rej => {
      	params.fail && params.fail(rej)
        muiview.loading.close()
      })
    } else {
      params.success && params.success()
      console.warn('channel:', params.channel)
      muiview.loading.close()
    }
  }
  pay.offlinePay = (params, type) => {
    muiview.loading.show()
    api.offlinepay({
      data: {
        orderCode: params.orderCode
      }
    }).then(res => {
      params.success && params.success(res)
      muiview.loading.close()
    }).catch (rej => {
      params.fail && params.fail(rej)
      muiview.loading.close()
    })
  }
  return pay
})

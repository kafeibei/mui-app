// https://www.jianshu.com/p/89297324cb93
define(['utils/muiview', 'config/router'], (muiview, defineRouter) => {
  let igexin = () => {
    if (muiview.osplus()) {
      document.addEventListener('plusready', () => {
        plus.push.addEventListener('click', (msg) => {
          // 判断是从本地创建还是离线推送的消息
          alert('点击处理消息 ' + JSON.stringify(msg))
        }, false)
        plus.push.addEventListener('receive', (msg) => {
          alert('接收到的透传推送' + JSON.stringify(msg))
          if (plus.os.name === 'iOS') {
            switch (msg.payload) {
              case 'LocalMSG': {
                alert('本地创建消息的 ' + JSON.stringify(msg))
                break
              }
              default: {
                // 测试本地推送
                createLocalPushMsg(msg)
              }
            }
          }
        }, false)
      }, false)
    } else {
      console.info('监控消息通知')
    }
  }
  function createLocalPushMsg (msg) {
    let options = {
      cover: false
    }
    plus.push.createMessage(msg.content, 'LocalMSG', options)
    if (plus.os.name === 'iOS') {
      outLine('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示！*')
    }
  }
  return igexin
})

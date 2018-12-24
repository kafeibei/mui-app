define(['utils/muiview', 'utils/muiajax', 'utils/storage'], (muiview, muiajax, storage) => {
  let record = {}
  record.start = (key, cbk) => {
    if (!muiview.osplus()) {
      cbk && cbk(1)
    } else {
      let recordObj = record.recordObj = plus.audio.getRecorder()
      if (recordObj === null) {
        cbk && cbk(-1, '获取当前设备的录音对象失败')
        return false
      }
      recordObj.record({filename: '_doc/audio/'}, (res) => {
        record.stopcbk && record.stopcbk(1)  // 录音结束
        plus.io.resolveLocalFileSystemURL(res, (entry) => {
          muiajax(res, key, (code, data) => {
            let localAudioInfo = storage.get('localAudioInfo') || {}
            localAudioInfo[data] = res
            storage.set('localAudioInfo', localAudioInfo)
            record.stopcbk && record.stopcbk(2, data)
          })
        }, (e) => {
          plus.nativeUI.toast('读取录音文件错误：' + e.message)
        })
      }, (e) => {
        record.stopcbk && record.stopcbk(-1, e.message)
      })
      cbk && cbk(1)
    }
  }
  record.stop = (key, cbk) => {
    if (!muiview.osplus()) {
      cbk && cbk(1)
      setTimeout(() => {
        cbk && cbk(2, 'http://hwcsp.cn:7089/api/file/contract/1545640841810.wav')
      }, 1000)
    } else if (record.recordObj) {
      if (cbk) {
        record.stopcbk = cbk  // 停止录音cbk
      }
      record.recordObj.stop()
    }
  }
  return record
})

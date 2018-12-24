define(['utils/muiview', 'utils/muiajax', 'utils/storage'], (muiview, muiajax, storage) => {
  let audio = {}
  audio.choose = (key, cbk) => {
    let uploadType = [{
      title: '录音'
    // }, {
    //   title: '选择录音文件'
    }]
    if (!muiview.osplus()) {
      cbk && cbk(0)
    } else {
      plus.nativeUI.actionSheet({
        cancel: '取消',
        buttons: uploadType
      }, (e) => {
        switch (e.index) {
          case 1: { // 录音
            audio.byRecord(key, cbk)
            break
          }
          case 2: { // 选择录音文件
            audio.bySystem(key, cbk)
            break
          }
          default: {
            console.info(e.index)
          }
        }
      })
    }
  }
  audio.byRecord = (key, cbk) => {
    cbk && cbk(0)
  }
  audio.bySystem = (key, cbk) => {
    return false
    plus.io.resolveLocalFileSystemURL('_doc/', entry => {
      entry.getDirectory('audio', {create: true}, (dir) => {
        let reader = dir.createReader()
        reader.readEntries(entries => {
          let musicList = []
          for (let i in entries) {
            if (entries[i].isFile) {
              musicList.push(localUrl + entries[i].name)
            }
          }
          muiajax(musicList[0], key, (code, data) => {
            let localAudioInfo = storage.get('localAudioInfo') || {}
            localAudioInfo[data] = musicList[0]
            storage.set('localAudioInfo', localAudioInfo)
          })
        })
      })
    })
  }
  audio.downloader = (src, cbk) => {
    let localAudioInfo = storage.get('localAudioInfo') || {}
    if (localAudioInfo[src]) {
      cbk(1, localAudioInfo[src])
    } else {
      let task = plus.downloader.createDownload(src, {
        filename: '_doc/audio/'
      }, (download, status) => {
        if (status === 200) {
          localAudioInfo[src] = download.filename
          cbk(1, download.filename)
          storage.set('localAudioInfo', localAudioInfo)
        } else {
          cbk(-1, '资源加载失败')
        }
      })
      task.start()
    }
  }
  audio.duration = (src, cbk, type) => {
    let audioObj
    if (!muiview.osplus() || type) {
      audioObj = audio.audioObj = new Audio()
      audioObj.src = src
      audioObj.onloadedmetadata = () => {
        cbk && cbk(1, parseInt(audioObj.duration))
      }
      audioObj.onerror = () => {
        cbk && cbk(-1, 'audio')
      }
    } else {
      audio.downloader(src, (code, local) => {
        if (code > 0) {
          audioObj = audio.audioObj = plus.audio.createPlayer(local)
          let duration = audioObj.getDuration()
          if (isNaN(duration)) {
            setTimeout(() => {
              duration = audioObj.getDuration()
              if (isNaN(duration)) {
                cbk && cbk(-1, 'h5+')
              } else {
                cbk && cbk(1, parseInt(duration))
              }
            }, 800)
          } else {
            cbk && cbk(1, parseInt(duration))
          }
        } else {
          cbk && cbk(-1, local)
        }

      })
    }
  }
  audio.play = (src, cbk) => {
    let audioObj
    if (!muiview.osplus()) {
      audioObj = audio.audioObj = new Audio()
      audioObj.src = src
      audioObj.play()
      audioObj.onerror = () => {
        cbk && cbk(-1)
      }
      audioObj.onloadedmetadata = () => {
        cbk && cbk(1)
      }
    } else {
      audio.downloader(src, (code, local) => {
        if (code > 0) {
          audioObj = audio.audioObj = plus.audio.createPlayer(local)
          audioObj.play(() => {
            audio.positioncbk && audio.positioncbk(1, parseInt(audioObj.getDuration()))
          }, (e) => {
            cbk && cbk(-1, e.message)
            audio.positioncbk && audio.positioncbk(-1, parseInt(e.message))
          })
          cbk && cbk(1)
        } else {
          cbk && cbk(-1, local)
        }
      })
    }
  }
  audio.stop = (cbk) => {
    audio.audioObj.pause()
    cbk && cbk(1)
  }
  audio.getPosition = (cbk) => {
    if (!muiview.osplus()) {
      audio.audioObj.ontimeupdate = () => {
        cbk && cbk(1, audio.audioObj.currentTime)
      }
      audio.audioObj.onended = () => {
        cbk && cbk(1, parseInt(audio.audioObj.duration))
      }
    } else {
      let duration = parseInt(audio.audioObj.getDuration())
      let i = 0
      audio.iternvalTime = setInterval(() => {
        i++
        let position = audio.audioObj.getPosition()
        cbk && cbk(1, position)
        if (i >= duration) {
          clearInterval(audio.iternvalTime)
          audio.iternvalTime = 0
        }
      }, 1000)
      if (cbk) {
        audio.positioncbk = cbk  // 进度cbk
      }
    }
  }
  return audio
})

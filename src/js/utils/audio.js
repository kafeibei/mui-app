define(['utils/muiview', 'utils/muiajax', 'utils/storage', 'utils/utils'], (muiview, muiajax, storage, utils) => {
  let audio = {}
  audio.choose = (key, cbk) => {
    let uploadType = [{
      title: '录音'
    }, {
      title: '选择录音文件'
    }]
    if (!muiview.osplus()) {
      cbk && cbk(1)
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
    cbk && cbk(1)
  }
  audio.filename = 'Music'
  audio.directory = (key, cbk) => {
    if (!muiview.osplus()) {
      cbk && cbk(1, [{
        name: 'Recorder_004.wav',
        modificationTime: '2018/12/21 17:37',
        size: '83KB',
        toLocalURL: '_doc/audio/Recorder_004.wav'
      }, {
        name: 'song.ogg',
        modificationTime: '2018/12/24 16:49',
        size: '5.5KB',
        toLocalURL: '_doc/audio/song.ogg'
      }])
    } else {
      plus.io.resolveLocalFileSystemURL('_doc/', entry => {
        entry.getDirectory(audio.filename, {create: true}, (dir) => {
          let reader = dir.createReader()
          let getEntries = () => {
            reader.readEntries(results => {
              if (results.length) {
                let entries = []
                for (let i in results) {
                  if (results[i].isFile) {
                    let item = {
                      name: results[i].name,
                      toLocalURL: results[i].toLocalURL()
                    }
                    results[i].getMetadata((metadata) => {
                      item.modificationTime = utils.formatDate(metadata.modificationTime, 'YYYY/MM/DD hh:mm')
                      item.size = utils.bytesToSize(metadata.size)
                      entries.push(item)
                    })
                  }
                }
                setTimeout(() => {
                  cbk && cbk(1, entries)
                }, 80)
              } else {
                cbk && cbk(1, [])
              }
            }, (error) => {
              cbk && cbk(-1, error.message)
            })
          }
          getEntries()
        })
      })
    }
  }
  audio.cleanHistory = (cbk) => {
    if (!muiview.osplus()) {
      cbk && cbk(1)
    } else {
      plus.io.resolveLocalFileSystemURL('_doc/', entry => {
        entry.getDirectory(audio.filename, {create: true}, (dir) => {
          dir.removeRecursively(() => {
            cbk && cbk(1)
          }, () => {
            cbk && cbk(-1)
          })

        })
      })
    }
  }
  audio.ajax = (res, key, cbk) => {
    muiajax(res, key, (code, data) => {
      let localAudioInfo = storage.get('localAudioInfo') || {}
      localAudioInfo[data] = res
      storage.set('localAudioInfo', localAudioInfo)
      cbk && cbk(code, data)
    })
  }
  audio.downloader = (src, cbk) => {
    if (muiview.platform() === 'android') {
      cbk(1, src)
      return false
    }
    let localAudioInfo = storage.get('localAudioInfo') || {}
    if (localAudioInfo[src]) {
      cbk(1, localAudioInfo[src])
    } else {
      let task = plus.downloader.createDownload(src, {
        filename: '_doc/' + audio.filename + '/'
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

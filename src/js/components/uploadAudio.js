define(['vue', 'components/record', 'utils/audio', 'utils/muiview', 'utils/utils', 'config/router'], (Vue, widgetRecord, audio, muiview, utils, defineRouter) => {
  widgetRecord()
  let uploadAudio = () => {
    Vue.component('upload-audio', {
      props: {
        data: Array,
        config: Object
      },
      template: `<div class="record-area">
        <div class="img-upload audio-upload">
          <div class="audio-box show-image hasimg" v-for="(item, index) in audioList" :key="index">
            <div class="audio-area flex">
              <div class="operate" @click="playAudio(item, index)">
                <span v-if="playInfo.on === 1 && playInfo.index === index" class="iconfont icon-pause"></span>
                <span v-else class="iconfont icon-play"></span>
              </div>
              <span class="time">{{item.intervalDuration || '00:00'}}</span>
              <div class="process-line flex-one flex">
                <div v-if="playInfo.on === 1 && playInfo.index === index" class="process-on" :style="processStyle"></div>
                <div v-else class="process-on"></div>
              </div>
            </div>
          </div>
          <div class="img-box add-image" @click="triggerUpload()" v-if="data.length < config.maxlength">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <p v-if="playInfo.on !== 0">当前播放状态：{{playInfo.on > 0 ? '播放中；当前播放音频地址：' + audioList[playInfo.index].src : '已暂停'}}</p>
        <div :id="sheetPopover.id" class="mui-popover mui-popover-action mui-popover-bottom" v-if="this.sheetPopover.active">
          <record-sheet :options="sheetPopover" @finish="doFinish"></record-sheet>
        </div>
  		</div>`,
      data () {
        return {
          audioList: [],
          playInfo: {
            on: 0,
            index: -1
          },
          processStyle: {
            width: 0
          },
          sheetPopover: {
            id: 'sheetPopover',
            active: ''
          }
        }
      },
      created () {
        this.addEventListener()
        if (this.data) {
          this.audioList = this.data
          this.audioList.forEach((item, index) => {
            setTimeout(() => {
              this.getDuration(item.src, (duration) => {
                this.$set(item, 'duration', duration)
                this.$set(item, 'intervalDuration', utils.intervalTime(duration))
              })
            }, index * 200)
          })
        }
      },
      methods: {
        addEventListener () {
          muiview.addEventListener('fireAudioChoose', defineRouter[this.config.key].id, (data) => {
            if (data && data.toLocalURL) {
              this.uploadAjax(data.toLocalURL)
            }
          })
        },
        uploadAjax (localUrl) {
          audio.ajax(localUrl, 'audio', (code, data) => {
            if (code > 0) {
              let item = {
                src: data
              }
              this.getDuration(item.src, (duration) => {
                item.duration = duration
                item.intervalDuration = utils.intervalTime(duration)
                this.audioList.push(item)
              })
            }
          })
        },
        getDuration (src, cbk) {
          audio.duration(src, (code, duration) => {
            if (code > 0) {
              cbk && cbk(duration)
            } else {
              cbk && cbk(0)
            }
          })
        },
        triggerUpload () {
          audio.choose(this.config.key, (code, res) => {
            if (code === 0) {
              this.sheetPopover.active = this.config.key
              setTimeout(() => {
                mui('#' + this.sheetPopover.id).popover('toggle')
              }, 50)
              return false
            } else if (code === 1) {
              muiview.openWebview({
                url: defineRouter.audiochoose.url,
                id: defineRouter.audiochoose.id,
                extras: {
                  pageFrom: this.config.key
                }
              })
            }
          })
        },
        deleteAudio (index) {
          muiview.confirm({
            message: '确定删除此音频？',
            onClose: (code) => {
              if (code) {
                this.audioList.splice(index, 1)
                // this.$emit('uploadafter', 1,  this.audioList)
              }
            }
          })
        },
        doFinish (code, res) {
          this.sheetPopover.active = ''
          if (code > 0) {
            let item = {
              src: res
            }
            this.getDuration(item.src, (duration) => {
              item.duration = duration
              item.intervalDuration = utils.intervalTime(duration)
              this.audioList.push(item)
            })

          }
        },
        playAudio (item, index) {
          if (this.playInfo.on === 1 && index === this.playInfo.index) {
            audio.stop((code) => {
              if (code > 0) {
                this.playInfo.on = -1
                this.playInfo.index = -1
              }
            })
          } else {
            if (this.playInfo.on > 0) {
              audio.stop((code) => {
                if (code > 0) {
                  this.playInfo.on = -1
                  this.playInfo.index = -1
                }
              })
            }
            audio.play(item.src, (code, message) => {
              if (code < 0) {
                muiview.toast({
                  message: message || '音频播放失败'
                })
              } else {
                this.processStyle = {
                  width: 0
                }
                this.processOn(item)
                this.playInfo.on = 1
                this.playInfo.index = index
              }
            })
          }
        },
        processOn (item) {
          audio.getPosition((code, second) => {
            if (code > 0) {
              if (second === item.duration) {
                this.processStyle = {
                  width: '100%'
                }
                this.playInfo.on = -1
                this.playInfo.index = -1
              } else {
                let audioProcess = (second * 100 / item.duration) + '%'
                this.processStyle = {
                  width: audioProcess
                }
              }
            }
          })
        }
      }
    })
  }
  return uploadAudio
})

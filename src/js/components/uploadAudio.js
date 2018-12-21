define(['vue', 'components/record', 'utils/audio', 'utils/muiview', 'utils/utils'], (Vue, widgetRecord, audio, muiview, utils) => {
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
                <span v-if="playInfo.on && playInfo.index === index" class="iconfont icon-pause"></span>
                <span v-else class="iconfont icon-play"></span>
              </div>
              <span class="time">{{item.intervalDuration || '00:00'}}</span>
              <div class="process-line flex-one flex">
                <div v-if="playInfo.on && playInfo.index === index" class="process-on" :style="processStyle"></div>
                <div v-else class="process-on"></div>
              </div>
            </div>
            <!--<p class="tips">文件大小：{{item.size}}</p>-->
            <!--<div class="delete-round" @click.stop="deleteAudio(index)">
              <i class="iconfont icon-del"></i>
            </div>-->
          </div>
          <div class="img-box add-image" @click="triggerUpload()" v-if="data.length < config.maxlength">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <div :id="sheetPopover.id" class="mui-popover mui-popover-action mui-popover-bottom" v-if="this.sheetPopover.active">
          <record-sheet :options="sheetPopover" @finish="doFinish"></record-sheet>
        </div>
  		</div>`,
      data () {
        return {
          audioList: [],
          playInfo: {
            on: false,
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
        getDuration (src, cbk) {
          audio.duration(src, (code, duration) => {
            if (code > 0) {
              cbk && cbk(duration)
            }
          })
        },
        triggerUpload () {
          audio.choose(this.config.key, (code, res) => {
            if (code === 0) {
              this.sheetPopover.active = 'record'
              setTimeout(() => {
                mui('#' + this.sheetPopover.id).popover('toggle')
              }, 50)
              return false
            }
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
          if (this.playInfo.on && index === this.playInfo.index) {
            audio.stop((code) => {
              if (code > 0) {
                this.playInfo.on = false
                this.playInfo.index = -1
              }
            })
          } else {
            if (this.playInfo.on) {
              audio.stop((code) => {
                if (code > 0) {
                  this.playInfo.on = false
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
                this.playInfo.on = true
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
                this.playInfo.on = false
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

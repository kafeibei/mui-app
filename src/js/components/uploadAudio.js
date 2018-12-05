define(['vue', 'utils/audio', 'utils/muiview', 'utils/utils'], (Vue, audio, muiview, utils) => {
  let uploadAudio = () => {
    Vue.component('upload-audio', {
      props: {
        data: Array,
        config: Object
      },
      template: `<div class="img-upload audio-upload">
        <div class="audio-box show-image hasimg" v-for="(item, index) in audioList" :key="index">
          <div class="audio-area flex">
            <div class="operate" @click="playAudio(item, index)">
              <span v-if="playInfo.on && playInfo.index === index" class="iconfont icon-pause"></span>
              <span v-else class="iconfont icon-play"></span>
            </div>
            <span class="time">{{formatTime(item.time)}}</span>
            <div class="process-line flex-one flex">
              <div v-if="playInfo.on && playInfo.index === index" class="process-on" :style="processStyle"></div>
              <div v-else class="process-on"></div>
            </div>
          </div>
          <p class="tips">文件大小：{{item.size}}</p>
          <div class="delete-round" @click.stop="deleteAudio(index)">
            <i class="iconfont icon-del"></i>
          </div>
        </div>
        <div class="img-box add-image" @click="triggerUpload()" v-if="data.length === config.maxlength">
          <i class="el-icon-plus"></i>
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
          }
        }
      },
      created () {
        if (this.data) {
          this.audioList = this.data
        }
      },
      methods: {
        formatTime (time) {
          return utils.formatTime(time)
        },
        triggerUpload () {
          audio.choose(this.config.key, (code, res) => {
            if (code > 0) {
              this.audioList.push(res)
            }
            this.$emit('uploadafter', code,  this.audioList)
          })
        },
        deleteAudio (index) {
          muiview.confirm({
            message: '确定删除此音频？',
            onClose: (code) => {
              if (code) {
                this.audioList.splice(index, 1)
                this.$emit('uploadafter', 1,  this.audioList)
              }
            }
          })
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
            audio.play(item.src, (code) => {
              if (code < 0) {
                muiview.toast({
                  message: '音频播放失败'
                })
              } else {
                audio.getPosition((code, second) => {
                  if (code > 0) {
                    let audioProcess = (second * 100 / item.time) + '%'
                    console.log(second, item.time)
                    this.processStyle = {
                      width: audioProcess
                    }
                  }
                })
                this.playInfo.on = true
                this.playInfo.index = index
              }
            })
          }
        }
      }
    })
  }
  return uploadAudio
})

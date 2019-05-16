define(['vue', 'utils/video', 'utils/muiview', 'utils/utils'], (Vue, video, muiview, utils) => {
  let uploadVideo = () => {
    Vue.component('upload-video', {
      props: {
        data: Array,
        config: Object
      },
      template: `<div class="video-area">
        <div class="img-upload video-upload">
          <div class="video-box show-image hasimg hg-flex" v-for="(item, index) in videoList" :key="index" @click="playVideo(item, index)" :class="{active: index === playInfo.index && playInfo.on === 1}">
            <div class="video-area"></div>
          </div>
          <div class="img-box add-image" @click="triggerUpload()" v-if="data.length < config.maxlength">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <p class="tips-status" v-if="playInfo.on !== 0">当前播放状态：{{playInfo.on > 0 ? '播放中；当前播放视频地址：' + playInfo.src : '已暂停'}}</p>
        <div v-if="!osplus">
          <div class="video-obj" v-if="playInfo.on > 0">
            <video id="videoDom" class="video-dom" :src="playInfo.src"></video>
          </div>
        </div>
        <div v-else>
          <div class="video-obj" v-if="playInfo.on > 0" id="videoDom"></div>
        </div>
  		</div>`,
      data () {
        return {
          videoList: [],
          playInfo: {
            on: 0,
            src: ''
          },
          osplus: ''
        }
      },
      created () {
        if (this.data) {
          this.videoList = this.data
        }
        this.osplus = muiview.osplus()
      },
      methods: {
        triggerUpload () {
          video.choose(this.config.key, (code, res) => {
            if (code > 0) {
              this.videoList.push({
                src: res
              })
            }
          })
        },
        playVideo (item, index) {
          if (this.playInfo.on === 1 && index === this.playInfo.index) {
            video.stop((code) => {
              this.playInfo.src = ''
              this.playInfo.index = -1
              this.playInfo.on = -1
            })
          } else {
            this.playInfo.src = item.src
            this.playInfo.index = index
            setTimeout(() => {
              this.playInfo.on = 1
              setTimeout(() => {
                video.play(item.src, (code, message) => {
                  if (code < 0) {
                    muiview.toast({
                      message: message || '视频播放错误',
                      cbk: () => {
                        this.playInfo.on = -1
                        this.playInfo.src = ''
                        this.playInfo.index = -1
                      }
                    })
                  }
                })
              }, 50)
            }, 50)
          }
        }
      }
    })
  }
  return uploadVideo
})

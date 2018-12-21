define(['vue', 'utils/muiview', 'utils/record'], (Vue, muiview, record) => {
  let recordSheet = () => {
    Vue.component('record-sheet', {
      props: ['options'],
      template: `<div class="mui-popover-content record-sheet">
        <div class="mui-table-title hg-flex">
          <span class="btntext" @click="doCancel">取消</span>
          <h3 class="flex-one">语音输入</h3>
          <span class="btntext">&nbsp;</span>
        </div>
        <div class="mui-table-view">
          <div class="mui-table-area">
            <div class="status-begin" v-if="status === -1" @click="startRecord">
              开始录音
            </div>
            <div class="going-area" v-else-if="status === 1">
              <div class="status-going">
                <div class="process-area">
                  <div class="process-going"></div>
                </div>
              </div>
              <div class="btntext" @click="stopRecord">说完了</div>
            </div>
            <div class="status-end" v-if="status ===  2">
              <p class="btntext">{{uploadText}}</p>
            </div>
          </div>
        </div>
    	</div>`,
      data () {
        return {
          status: 0,
          uploadText: ''
        }
      },
      created () {
        this.status = -1
      },
      methods: {
        doCancel () {
          if (this.status === 1) {
            this.stopRecord()
          }
          this.$emit('finish', -1)
          mui('#' + this.options.id).popover('toggle')
        },
        doConfirm (res) {
          this.$emit('finish', 1, res)
          mui('#' + this.options.id).popover('toggle')
        },
        startRecord () {
          record.start('record', (code) => {
            if (code > 0) {
              this.status = 1
            }
          })
        },
        stopRecord () {
          record.stop('record', (code, res) => {
            if (code === 1) {
              this.status = 2
              this.uploadText = '录音上传中'
            } else if (code === 2) {
              this.uploadText = '录音上传成功'
              setTimeout(() => {
                this.doConfirm(res)
                this.status = 0
              }, 1000)
            }
          })
        }
      }
    })
  }
  return recordSheet
})

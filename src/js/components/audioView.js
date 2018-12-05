define(['vue', 'components/uploadAudio'], (Vue, uploadAudio) => {
  uploadAudio()
  let audioView = () => {
    Vue.component('audio-view', {
      props: {
        data: Array,
        config: Object
      },
      template: `<div class="mui-table-area">
        <div class="mui-table-view-title">
          <span class="label">{{config.title}}<span v-if="config.maxlength">({{config.maxlength}}张)</span><em class="required" v-if="config.required">*</em></span>
          <span class="tips" v-if="config.maxlength">已添加{{data.length}}/{{config.maxlength}}个</span>
        </div>
        <upload-audio :data="data" :config="{
          key: config.key
        }"></upload-audio>
        <div class="tips warning tips-warning" v-if="config.tips">
          <span class="tips-title">注意：{{config.tips}}</span>
        </div>
      </div>`
    })
  }
  return audioView
})

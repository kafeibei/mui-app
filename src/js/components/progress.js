define(['vue', 'utils/muiview'], (Vue, muiview) => {
  let widgetProgress = () => {
    Vue.component('widget-progress', {
      props: {
        config: {
          type: Object,
          default: {}
        },
        data: Number
      },
      template: `<div class="mui-progress">
        <p class="mui-progressbar mui-progressbar-in"><span></span></p>
      </div>`,
      data () {
        return {
          quantity: 0
        }
      },
      created () {
        setTimeout(() => {
          this.initProgress()
        }, 800)
        this.quantity = this.data || 0
        this.triggerFinish()
      },
      methods: {
        initProgress () {
          let progressDom = mui(".mui-progressbar")
          mui(progressDom).progressbar().setProgress(this.quantity)
        },
        triggerFinish (code) {
          this.$emit('finish', this.quantity, this.config)
        }
      }
    })
  }
  return widgetProgress
})

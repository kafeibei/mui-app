define(['vue', 'utils/muiview'], (Vue, muiview) => {
  let widgetRange = () => {
    Vue.component('widget-range', {
      props: {
        config: {
          type: Object,
          default: {}
        },
        data: Number
      },
      template: `<div class="mui-range hg-flex">
        <label class="number-tips">{{config.min}}</label>
        <div class="flex-one mui-input-row mui-input-range">
          <input type="range" id='block-range' :step="config.step" v-model="quantity" :min="config.min" :max="config.max" @change="triggerCount" />
        </div>
        <label class="number-tips">{{config.max}}</label>
      </div>`,
      data () {
        return {
          quantity: 0
        }
      },
      created () {
        this.config.step = this.config.step || 1
        this.quantity = this.data || this.config.min || 0
        this.triggerFinish()
      },
      methods: {
        triggerCount () {
          this.triggerFinish()
        },
        triggerFinish (code) {
          this.$emit('finish', this.quantity, this.config)
        }
      }
    })
  }
  return widgetRange
})

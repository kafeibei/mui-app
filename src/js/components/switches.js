define(['vue', 'utils/muiview'], (Vue, muiview) => {
  let widgetSwitches = () => {
    Vue.component('widget-switches', {
      props: {
        config: {
          type: Object,
          default: {}
        },
        data: Number
      },
      template: `<div class="mui-switch mui-switch-mini mui-switches" :class="{'mui-active': this.quantity}" @tap="triggerCount">
				<div class="mui-switch-handle"></div>
			</div>`,
      data () {
        return {
          quantity: false
        }
      },
      created () {
        this.quantity = this.data || false
        this.triggerFinish()
      },
      methods: {
        triggerCount () {
          this.quantity = !this.quantity
          this.triggerFinish()
        },
        triggerFinish () {
          this.$emit('finish', this.quantity, this.config)
        }
      }
    })
  }
  return widgetSwitches
})

define(['vue', 'previewimage', 'utils/upload', 'utils/muiview'], (Vue, previewimage, upload, muiview) => {
  let widgetNumbox = () => {
    Vue.component('widget-numbox', {
      props: {
        config: {
          type: Object,
          default: {}
        },
        data: Number
      },
      template: `<div class="mui-numbox">
			  <button class="mui-btn mui-numbox-btn-minus" :disabled="minusDisabled" type="button" @tap="triggerQuantity(-1)">-</button>
			  <input class="mui-numbox-input" type="number" v-model="quantity" @change="triggerCount" />
			  <button class="mui-btn mui-numbox-btn-plus" :disabled="plusDisabled" type="button" @tap="triggerQuantity(1)">+</button>
			</div>`,
      data () {
        return {
          quantity: 0,
          copyquantity: 0,
          minusDisabled: false,
          plusDisabled: false
        }
      },
      created () {
        this.config.step = this.config.step || 1
        this.quantity = this.data || this.config.min || 0
        this.copyQuantity(1)
        this.judgeDisabled()
      },
      methods: {
        triggerQuantity (code) {
          this.quantity = code > 0 ? this.quantity + this.config.step : this.quantity - this.config.step
          this.copyQuantity(1)
          this.judgeDisabled()
        },
        triggerCount () {
          let errorMessage = ''
          if (this.config.min && this.quantity < this.config.min) {
            errorMessage = '输入数字最小不能低于' + this.config.min
          } else if (this.config.max && this.quantity > this.config.max) {
            errorMessage = '输入数字最大不能超过' + this.config.max
          }
          if (errorMessage) {
            muiview.toast({
              message: errorMessage,
              onClose: () => {
                this.copyQuantity(-1)
              }
            })
            return false
          }
          this.copyQuantity(1)
        },
        judgeDisabled () {
          if (this.config.min && this.quantity === this.config.min) {
            this.minusDisabled = true
          } else {
            this.minusDisabled = false
          }
          if (this.config.max && this.quantity === this.config.max) {
            this.plusDisabled = true
          } else {
            this.plusDisabled = false
          }
        },
        copyQuantity (code) {
          if (code > 0) {
            this.copyquantity = this.quantity
            this.$emit('finish', this.quantity, this.config)
          } else {
            this.quantity = this.copyquantity
          }
        }
      }
    })
  }
  return widgetNumbox
})

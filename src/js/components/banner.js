define(['vue', 'mixins/index', 'utils/utils'], (Vue, mixins, utils) => {
  let widgetBanner = () => {
    Vue.component('widgetBanner', {
      props: ['data', 'config'],
      mixins: [mixins],
      template: `<div :id="idKey" class="mui-slider">
          <div class="mui-slider-group" :class="{'mui-slider-loop': config.loop}" v-if="data && data[0]">
            <!--支持循环，需要重复图片节点 -->
            <div class="mui-slider-item mui-slider-item-duplicate" v-if="config.loop" @tap="openSpecialPage(data[data.length -1].url)">
              <img :src="data[data.length -1].imgSrc" class="img">
            </div>
            <div class="mui-slider-item" v-for="(item, index) in data" :key="index">
              <slot v-if="config.custom" :name="'banner_' + index"></slot>
              <img v-else :src="item.imgSrc" class="img">
            </div>
            <!--支持循环，需要重复图片节点-->
            <div class="mui-slider-item mui-slider-item-duplicate" v-if="config.loop" @tap="openSpecialPage(data[0].url)">
              <img :src="data[0].imgSrc" class="img">
            </div>
          </div>
					<div class="mui-slider-indicator" v-if="config.indicator">
						<div class="mui-indicator" :class="{'mui-active': index == 0}" v-for="(item, index) in data"></div>
					</div>
				</div>`,
      watch: {
        'data' (val) {
          if (val && val[0]) {
            if (this.data.length && this.data.length > 1) {
              if (this.sliderDom) {
                this.sliderDom.stopped = false
              } else {
                this.slider()
              }
            } else {
              this.sliderDom && (this.sliderDom.stopped = true)
            }
          } else {
            this.slider()
          }
        }
      },
      data () {
        return {
          idKey: '',
          sliderDom: ''
        }
      },
      created () {
        this.idKey = 'slider-' + utils.randomNum(6)
        if (this.data && this.data[0]) {
          this.slider()
        }
      },
      methods: {
        slider () {
          setTimeout(() => {
            this.sliderDom = mui('#' + this.idKey).slider({
              interval: typeof this.config.interval === 'undefined' ? 3000 :  this.config.interval
            })
          })
        }
      }
    })
  }
  return widgetBanner
})

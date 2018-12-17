define(['vue', 'utils/muiview', 'config/function'], (Vue, muiview, functions) => {
  let pickerPopover = () => {
    Vue.component('picker-popover', {
      props: ['options'],
      template: `<div class="mui-popover-content picker-popover">
        <ul class="mui-table-view">
          <li class="mui-table-view-cell hg-flex" v-for="(item, index) in functions" :key="item" :class="{'mui-active': curActive.name === item.name}" @click="doActive(item)">{{item.title}}</li>
        </ul>
    	</div>`,
      data () {
        return {
          functions: functions,
          curActive: {}
        }
      },
      methods: {
        doActive (item) {
          this.curActive = item
          this.$emit('finish', 1, this.curActive)
          mui('#' + this.options.id).popover('toggle')
        }
      }
    })
  }
  return pickerPopover
})

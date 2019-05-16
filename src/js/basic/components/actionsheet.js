define(['vue', 'utils/muiview', 'config/function'], (Vue, muiview, functions) => {
  let actionSheet = () => {
    Vue.component('action-sheet', {
      props: ['options', 'data'],
      template: `<div class="mui-popover-content action-sheet">
        <div class="mui-table-title hg-flex">
          <span class="btntext" @click="doCancel">取消</span>
          <h3 class="flex-one">选择功能类型</h3>
          <span class="btntext" @click="doConfirm">确定</span>
        </div>
        <ul class="mui-table-view">
          <li class="mui-table-view-cell hg-flex" v-for="(item, index) in functions" :key="item" :class="{'item-active': curActive.name === item.name}" @click="doActive(item)">{{item.title}}</li>
        </ul>
    	</div>`,
      data () {
        return {
          functions: functions,
          curActive: {}
        }
      },
      created () {
        if (this.data) {
          this.curActive.name = this.data.name
        }
      },
      methods: {
        doCancel () {
          this.$emit('finish', -1)
          mui('#' + this.options.id).popover('toggle')
        },
        doConfirm () {
          if (!this.curActive.name) {
            muiview.toast({
              message: '请先选择需要的数据'
            })
            return false
          }
          this.$emit('finish', 1, this.curActive)
          mui('#' + this.options.id).popover('toggle')
        },
        doActive (item) {
          this.curActive = item
        }
      }
    })
  }
  return actionSheet
})

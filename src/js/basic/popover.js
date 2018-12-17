require(['vue', 'components/navBar', 'basic/components/popover'], (Vue, navBar, pickerPopover) => {
  navBar()
  pickerPopover()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '弹出菜单',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        pickerInfo: {},
        pickerPopover: {
          id: 'actionPopover',
          active: ''
        }
      }
    },
    created () {
    },
    methods: {
      finishPicker (code, data) {
        if (code > 0) {
          this.pickerInfo = data
        }
      }
    }
  })
})

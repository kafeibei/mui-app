require(['vue', 'components/navBar', 'basic/components/actionsheet'], (Vue, navBar, actionSheet) => {
  navBar()
  actionSheet()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '操作表',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        sheetInfo: {},
        sheetPopover: {
          id: 'actionSheet',
          active: ''
        }
      }
    },
    methods: {
      actionSheet () {
        this.sheetPopover.active = this.sheetPopover.id
        setTimeout(() => {
          mui('#' + this.sheetPopover.id).popover('toggle')
        }, 50)
      },
      finishSheet (code, data) {
        if (code > 0) {
          this.sheetInfo = data
        }
        setTimeout(() => {
          this.sheetPopover.active = ''
        }, 50)
      }
    }
  })
})

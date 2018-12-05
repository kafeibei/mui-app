require(['vue', 'components/navBar', 'utils/muiview', 'utils/map', 'api/terminal', 'config/router'], (Vue, navBar, muiview, utilsMap, api, defineRouter) => {
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '周日(03月11日)服务证据采集',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          },
          right: {
            title: '保存',
            action: this.doSubmit
          }
        },
        address: '',
        listItems: [],
        curItem: {},
        params: {}
      }
    },
    created () {
      utilsMap.init('map', (code) => {
        if (code > 0) {
          utilsMap.nearby((data) => {
            if (data && data[0]) {
              this.listItems = data
              this.curItem = data[0]
            }
          })
        }
      })
      muiview.webviewParams(params => {
        this.params.pageFrom = params.pageFrom
      })
    },
    methods: {
      addressSearch () {
        utilsMap.goSpecificPosition(this.address, (code) => {
          if (code > 0) {
            this.address = ''
          }
        })
      },
      doSubmit () {
        let checkedItems = this.listItems.filter(item => {
          if (item.checked) {
            return item
          }
        })
        if (!checkedItems[0]) {
          muiview.toast({
            message: '请先选择数据'
          })
          return false
        }
      },
      chooseTrigger (item) {
        this.curItem = item
      },
      currentPosition () {
        utilsMap.goCurrentPosition()
      }
    }
  })
})

require(['vue', 'components/navBar', 'components/widgetLoading', 'utils/muiview', 'utils/map'], (Vue, navBar, widgetLoading, muiview, utilsMap) => {
  navBar()
  widgetLoading()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '地图组件',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        address: '',
        listItems: [],
        curItem: {},
        errorcode: '',
        finish: false
      }
    },
    created () {
      utilsMap.init('map', (code) => {
        if (code > 0) {
          utilsMap.nearby((code, data) => {
            this.finish = true
            if (code > 0) {
              this.listItems = data
              this.errorcode = ''
            } else {
              this.listItems = []
              this.errorcode = data
            }
          })
        }
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
      currentPosition () {
        muiview.loading.show()
        utilsMap.goCurrentPosition(code => {
          muiview.loading.close()
        })
      },
      goSpecificPoint (item) {
        muiview.loading.show()
        this.curItem = item
        utilsMap.centerMap(item.point, ( code) => {
          muiview.loading.close()
        })
      }
    }
  })
})

require(['vue', 'components/navBar', 'components/numbox', 'components/range', 'components/progress', 'utils/muiview'], (Vue, navBar, widgetNumbox, widgetRange, widgetProgress, muiview) => {
  navBar()
  widgetNumbox()
  widgetRange()
  widgetProgress()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '表单元素',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        numboxConfig: {
          max: 80,
          min: 10,
          step: 10
        },
        progressConfig: {
          step: 10
        },
        quantity: {
          numbox: 30,
          range: 40,
          progress: 20
        }
      }
    },
    methods: {
      finishNumbox (quantity, config) {
        this.quantity.numbox = quantity
      },
      finishRange (quantity, config) {
        this.quantity.range = quantity
      },
      finishProgress (quantity, config) {
        this.quantity.range = quantity
      }
    }
  })
})

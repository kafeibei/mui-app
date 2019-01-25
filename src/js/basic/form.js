require(['vue', 'components/navBar', 'components/numbox', 'utils/muiview'], (Vue, navBar, widgetNumbox, muiview) => {
  navBar()
  widgetNumbox()
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
        quantity: 0
      }
    },
    methods: {
      finishNumbox (quantity, config) {
        this.quantity = quantity
      }
    }
  })
})

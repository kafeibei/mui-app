require(['vue', 'components/navBar', 'components/miniCalendar', 'utils/utils', 'utils/muiview'], (Vue, navBar, miniCalendar, utils, muiview) => {
  miniCalendar()
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '日历选择',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        fcEvents: [
          {
            start: '2018-12-23',
            end: '2018-12-23'
          },
          {
            start: '2018-12-24',
            end: '2018-12-25'
          }
        ]
      }
    },
    methods: {
      dayClick (day, event) {
        console.log('ayya', day, event)
      }
    }
  })
})

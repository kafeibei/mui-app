require(['vue', 'components/navBar', 'muiview/dtPicker', 'utils/utils'], (Vue, navBar, dtPicker, utils) => {
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '日期时间选择器',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        pickerInfo: {}
      }
    },
    created () {
      this.pickerInfo.datetime = utils.formatDate(null, 'YYYY-MM-DD hh:mm')
      this.pickerInfo.date = utils.formatDate(null, 'YYYY-MM-DD')
      this.pickerInfo.month = utils.formatDate(null, 'YYYY-MM')
    },
    methods: {
      pickerTime (key, options) {
        let timePickerBack = dtPicker(options, this.pickerInfo[key])
        timePickerBack((item, muiPicker) => {
          this.$set(this.pickerInfo, key, item)
          muiPicker.dispose()
        })
      }
    }
  })
})

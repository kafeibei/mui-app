require(['vue', 'components/navBar', 'muiview/firstPicker', 'config/function', 'muiview/addressPicker'], (Vue, navBar, firstPicker, functions, addressPicker) => {
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '下拉选择框',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        popInfo: {
          first: {
            value: 'popover'
          },
          address: {
            provinceId: '430000',
            cityId: '430100',
            regionId: '430105'
          }
        }
      }
    },
    created () {

    },
    methods: {
      popLayer (key) {
        let popLayerBack
        switch (key) {
          case 'first':
            popLayerBack = this.firstLayer()
            break;
          case 'address':
            popLayerBack = this.addressLayer()
            break;
          default:

        }
        popLayerBack((item, muiPicker) => {
          this.$set(this.popInfo, key, item[0] || item)
          muiPicker.dispose()
        }, this.popInfo[key])
      },
      firstLayer () {
        let data = []
        functions.forEach(item => {
          data.push({
            text: item.title,
            value: item.name
          })
        })
        return firstPicker(data)
      },
      addressLayer () {
        return addressPicker()
      }
    }
  })
})

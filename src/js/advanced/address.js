require(['vue', 'components/navBar', 'utils/muiview', 'utils/address'], (Vue, navBar, muiview, addressPicker) => {
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '地址选择',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        addressInfo: {}
      }
    },
    created () {

    },
    methods: {
      setAddress () {
        addressPicker[1](condMap => {
          this.$set(this.addressInfo, 'province', condMap.province)
          this.$set(this.addressInfo, 'provinceId', condMap.provinceId)
          this.$set(this.addressInfo, 'city', condMap.city)
          this.$set(this.addressInfo, 'cityId', condMap.cityId)
          this.$set(this.addressInfo, 'region', condMap.region)
          this.$set(this.addressInfo, 'regionId', condMap.regionId)
        }, {
          provinceId: this.addressInfo.provinceId,
          cityId: this.addressInfo.cityId,
          regionId: this.addressInfo.regionId
        })
      }
    }
  })
})

define(['mui', 'muiPicker', 'muiPoppicker', 'config/addressData'], (mui, _muiPicker, _muiPoppicker, addressData) => {
  let addressPicker = () => {
    let muiPicker
    if (mui.PopPicker) {
      muiPicker = new mui.PopPicker({
        layer: 3
      })
      muiPicker.setData(addressData)
      let pickerBack = (cbk, params) => {
        if (params) {
          params.provinceId && muiPicker.pickers[0].setSelectedValue(params.provinceId)
          params.cityId && muiPicker.pickers[1].setSelectedValue(params.cityId)
          params.regionId && muiPicker.pickers[2].setSelectedValue(params.regionId)
        }
        muiPicker.show(item => {
          let condMap = {}
          if (item) {
            if (item[0]) {
              condMap.provinceId = item[0].value
              condMap.province = item[0].text
            }
            if (item[1]) {
              condMap.cityId = item[1].value
              condMap.city = item[1].text
            }
            if (item[2]) {
              condMap.regionId = item[2].value
              condMap.region = item[2].text
            }
          }
          cbk && cbk(condMap, muiPicker)
        })
      }
      return pickerBack
    }
  }
  return addressPicker
})

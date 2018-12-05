define(['mui', 'muiPicker', 'muiPoppicker'], (mui, _muiPicker, _muiPoppicker) => {
  let firstPicker = (data) => {
    if (mui.PopPicker) {
      let muiPicker = new mui.PopPicker()
      muiPicker.setData(data)
      let pickerBack = (cbk, params) => {
        if (params) {
          params.selected && muiPicker.pickers[0].setSelectedValue(params.selected)
        }
        muiPicker.show(item => {
          cbk && cbk(item)
        })
      }
      return pickerBack
    }
  }
  return firstPicker
})

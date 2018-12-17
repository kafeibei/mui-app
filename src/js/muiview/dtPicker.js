define(['mui', 'muiPicker'], (mui, _muiPicker) => {
  let dtPicker = (options = {}, value) => {
    if (value) {
      options.value = value
    }
    let muiPicker = new mui.DtPicker(options)
    let pickerBack = (cbk, params) => {
      muiPicker.show(item => {
        cbk && cbk(item.value, muiPicker)
      })
    }
    return pickerBack
  }
  return dtPicker
})

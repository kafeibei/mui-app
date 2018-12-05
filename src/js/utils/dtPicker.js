define(['mui', 'muiPicker'], (mui, _muiPicker) => {
  let dtPicker = () => {
    let muiPicker = new mui.DtPicker()
    let pickerBack = (cbk, params) => {
      muiPicker.show(item => {
        cbk && cbk(item.value)
      })
    }
    return pickerBack
  }
  return dtPicker
})

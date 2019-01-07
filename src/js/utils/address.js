define(['mui', 'muiPicker', 'muiPoppicker', 'api/global', 'utils/storage'], (mui, _muiPicker, _muiPoppicker, api, storage) => {
  if (mui.PopPicker) {
    let getAddressInfo = (cbk) => {
      let addressInfo = storage.get('addressInfo')
      if (addressInfo) {
        cbk && cbk(addressInfo)
      } else {
        api.addressConfig({
          mock: true
        }).then(res => {
          let addressSheet = []
          if (res.province) {
            Object.keys(res.province).forEach(pCode => {
              let provinceInfo = {
                value: pCode,
                text: res.province[pCode],
                children: []
              }
              if (res.city) {
                Object.keys(res.city[pCode]).forEach(CCode => {
                    let cityInfo = {
                      value: CCode,
                      text: res.city[pCode][CCode],
                      children: []
                    }
                    if (res.area) {
                      Object.keys(res.area[CCode]).forEach(ACode => {
                          let areaInfo = {
                            value: ACode,
                            text: res.area[CCode][ACode]
                          }
                          cityInfo.children.push(areaInfo)
                      })
                    }
                    provinceInfo.children.push(cityInfo)
                })
              }
              addressSheet.push(provinceInfo)
            })
          }
          storage.set('addressInfo', addressSheet)
          cbk && cbk(addressSheet)
        }, rej => {
          console.error('rej', JSON.stringify(rej))
        })
      }
    }

    let addressPicker = new mui.PopPicker({
      layer: 3
    })
    let addressData
    getAddressInfo(data => {
      addressData = data
      addressPicker.setData(data)
    })
    let pickerBack = (cbk, params) => {
      if (params) {
        params.provinceId && addressPicker.pickers[0].setSelectedValue(params.provinceId)
        params.cityId && addressPicker.pickers[1].setSelectedValue(params.cityId)
        params.regionId && addressPicker.pickers[2].setSelectedValue(params.regionId)
      }
      addressPicker.show(item => {
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
        cbk && cbk(condMap)
      })
    }
    return [addressPicker, pickerBack]
  }
  return [{}, ()=>{}]
})

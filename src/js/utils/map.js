define(['utils/muiview', 'api/global'], (muiview, api) => {
  let utilsMap = {}

  // 获取当前位置的经纬度
  utilsMap.getCurrentPosition = (cbk) => {
    plus.geolocation.getCurrentPosition((position) => {
      position.coords.longitude = '113.04397'
      position.coords.latitude = '28.16634'
      cbk && cbk(position.coords.longitude, position.coords.latitude)
    }, (e) => {
      muiview.toast({
        message: '异常：' + e.message
      })
    })
  }

  // 以当前位置为中心
  utilsMap.goCurrentPosition = () => {
    utilsMap.getCurrentPosition((longitude, latitude) => {
      utilsMap.centerMap(longitude, latitude)
    })
  }

  // 地址转化为经纬度，并以该经纬度为中心
  utilsMap.goSpecificPosition = (address, cbk) => {
    if (!address) {
      return false
    }
    if (!muiview.osplus()) {
      cbk && cbk(1)
    } else {
      plus.maps.Map.geocode(address,{city:"北京"},(event) => {
    		let point = event.coord
        utilsMap.centerMap(point.longitude, point.latitude)
        cbk && cbk(1)
    	}, (e) => {
        cbk && cbk(-1)
    		console.log("Failed:"+JSON.stringify(e));
    	})
    }
  }

  // 实例化地图
  utilsMap.initMap = (id, longitude, latitude, cbk) => {
    let appMap = utilsMap.appMap = new plus.maps.Map(id, {
      top: 0,
      left: 0,
      width: '100%',
      height: 300
    })
    // appMap.showUserLocation(true)
    utilsMap.centerMap(longitude, latitude)
    utilsMap.addMarker(longitude, latitude)
    cbk && cbk(1)
  }

  // 以特定经纬度为中心
  utilsMap.centerMap = (longitude, latitude) => {
    let curPoint = new plus.maps.Point(longitude, latitude)
    utilsMap.appMap.centerAndZoom(curPoint, 15)
  }

  utilsMap.addMarker = (longitude, latitude, cbk) => {
    // let curPoint = new plus.maps.Point(longitude, latitude)
    // console.log('addMarker', addMarker)
    // let curPosition = new plus.maps.Position(curPoint)
    // console.log('curMarker', longitude, latitude)
    // console.log('curPosition', JSON.stringify(curPosition))

    // let curMarker = new plus.maps.Marker(curPoint)
    // curMarker.setIcon('http://iconfont.alicdn.com/t/1532136228348.png@200h_200w.jpg')
    // curMarker.setLabel('HBuilder')
  }

  // 经纬度转化为地址
  utilsMap.reverseGeocode = (longitude, latitude, cbk) => {
    let curPoint = new plus.maps.Point(longitude, latitude)
    plus.maps.Map.reverseGeocode(curPoint,{},function(event){
      cbk && cbk(event.address)
  	},function(e){
  		console.log("Failed:"+JSON.stringify(e));
  	})
  }

  utilsMap.nearby = (cbk) => {
    if (!muiview.osplus()) {
      api.locationConfig()
        .then(res => {
          cbk && cbk(res)
        })
    } else {
      utilsMap.getCurrentPosition((longitude, latitude) => {
        let nearbyAddress = []
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            utilsMap.reverseGeocode(longitude - i * 0.002, latitude - j * 0.002, (address) => {
              nearbyAddress.push({
                title: address,
                id: [i, j].join('')
              })
              cbk && cbk(nearbyAddress)
            })
          }
        }
      })
    }
  }

  utilsMap.getCurrentCenter = () => {
    if (utilsMap.appMap) {
      utilsMap.appMap.getCurrentCenter((state, point) => {
        if (0 == state) {
          setTimeout(() => {
            utilsMap.addMarker(point.longitude, point.latitude)
          }, 800)
        } else {
          console.log('failed')
        }
      })
    }
  }

  // 地图组件入口
  utilsMap.init = (id, cbk) => {
    if (!id) {
      return false
    }
    if (!muiview.osplus()) {
      cbk && cbk(1)
    } else {
      mui.plusReady(() => {
        utilsMap.getCurrentPosition((longitude, latitude) => {
          utilsMap.initMap(id, longitude, latitude, cbk)
        }, () => {
          cbk && cbk(-1)
        })
      })
    }
  }

  return utilsMap
})

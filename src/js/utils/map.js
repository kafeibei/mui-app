define(['utils/muiview', 'api/global'], (muiview, api) => {
  let utilsMap = {}

  // 获取当前位置的经纬度
  utilsMap.getCurrentPosition = (cbk) => {
    plus.geolocation.getCurrentPosition((position) => {
      cbk && cbk(1, position.coords)
    }, (e) => {
      cbk && cbk(-1, e.message)
    })
  }

  // 以当前位置为中心
  utilsMap.goCurrentPosition = (cbk) => {
    if (!muiview.osplus()) {
      setTimeout(() => {
        cbk && cbk(1)
      }, 1000)
    } else {
      utilsMap.getCurrentPosition((code, point) => {
        utilsMap.centerMap(point, cbk)
      })
    }
  }

  // 地址转化为经纬度，并以该经纬度为中心
  utilsMap.goSpecificPosition = (address, cbk) => {
    if (!address) {
      return false
    }
    if (!muiview.osplus()) {
      cbk && cbk(1)
    } else {
      plus.maps.Map.geocode(address, {city: utilsMap.city}, (event) => {
    		let point = event.coord
        utilsMap.centerMap(point, cbk)
    	}, (e) => {
        cbk && cbk(-1)
        muiview.toast({
          message: '异常：' + e.message
        })
    	})
    }
  }

  // 实例化地图
  utilsMap.initMap = (id, point, cbk) => {
    let appMap = utilsMap.appMap = new plus.maps.Map(id, {
      top: 0,
      left: 0,
      width: '100%',
      height: 300,
      zoom: 15
    })
    // appMap.showUserLocation(true)
    utilsMap.centerMap(point, cbk)
  }

  // 以特定经纬度为中心
  utilsMap.centerMap = (point, cbk) => {
    if (!muiview.osplus()) {
      setTimeout(() => {
        cbk && cbk(1)
      }, 1000)
    } else {
      let curPoint = new plus.maps.Point(point.longitude, point.latitude)
      utilsMap.appMap.centerAndZoom(curPoint, 15)
      utilsMap.addMarker(point, cbk)
    }
  }

  utilsMap.addMarker = (point, cbk) => {
    utilsMap.appMap.removeOverlay(utilsMap.curMarker)
    let curPoint = new plus.maps.Point(point.longitude, point.latitude)
    let curMarker = utilsMap.curMarker = new plus.maps.Marker(curPoint)

    let curPosition = new plus.maps.Position(curPoint)
    curMarker.setLabel(curPosition.name || '')
    utilsMap.appMap.addOverlay(curMarker)
    cbk && cbk(1)
  }

  // 经纬度转化为地址
  utilsMap.reverseGeocode = (point, cbk) => {
    let curPoint = new plus.maps.Point(point.longitude, point.latitude)
    plus.maps.Map.reverseGeocode(curPoint, {}, (event) => {
      cbk && cbk(1, event.address)
  	}, (e) => {
      cbk && cbk(-1, e.message)
  	})
  }

  utilsMap.nearby = (cbk) => {
    if (!muiview.osplus()) {
      api.locationConfig()
        .then(res => {
          cbk && cbk(1, res)
        })
    } else {
      utilsMap.getCurrentPosition((code, point) => {
        let curSearch = new plus.maps.Search(utilsMap.appMap)
        let results = []
        let mKeys = ['小区', '写字楼', '商场', '餐厅', '酒店', '医院']
        let mLen = mKeys.length
        let mNumber = 0
        let mRight = 0
        let mError = 0
        curSearch.onPoiSearchComplete = (state, result) => {
          mNumber ++
          if (state === 0) {
            mRight ++
            if (result.currentNumber > 0) {
              for (let i = 0,len = result.currentNumber; i < len; i++) {
                let pos = result.getPosition(i)
                pos.longlat = [pos.point.longitude,  pos.point.latitude].join('_')
                results.push(pos)
              }
            }
          } else {
            mError ++
          }
          if (mNumber === mLen) {
            if (mError === mNumber) {
              cbk && cbk(-1, '检索失败')
            }
            if (results.length === 0) {
              cbk && cbk(-1, '没有检索到结果')
            } else {
              utilsMap.city = results[0].city
              cbk && cbk(1, results)
            }
          }
        }
        let curPoint = new plus.maps.Point(point.longitude, point.latitude)
        for (let i = 0; i < mLen; i++) {
          curSearch.poiSearchNearBy(mKeys[i], curPoint, 350)
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
        utilsMap.getCurrentPosition((code, point) => {
          utilsMap.initMap(id, point, cbk)
        }, () => {
          cbk && cbk(-1)
        })
      })
    }
  }
  return utilsMap
})

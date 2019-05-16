define(['config/config', 'config/setting'], (getConfig, getSetting) => {
  var utils = {}
  /*
   * 获取随机串
   * */
  utils.randomNum = (len) => {
    var salt = ''
    for (var i = 0; i < len; i++) {
      let tmp = parseInt(Math.floor(Math.random() * 10))
      if (!tmp) {
        tmp = '2'
      }
      salt += tmp
    }
    return salt
  }

  utils.codeParam = (param) => {
    let codeParam = []
    for (let i in param) {
      codeParam.push(encodeURIComponent(i) + '=' + encodeURIComponent(param[i] == null ? '' : param[i]))
    }
    return codeParam.join('&')
  }

  /*
   * 图片串接 createImgsrc
   * */
  utils.createImgsrc = (data, options = {}) => {
    if (!data) {
      return ''
    }
    return data
  }

  /*
  * 伪空
  */
  utils.fakeEmpty = (data) => {
    if (typeof data === 'undefined' || data === '') {
      return true
    }
  }

  /**
   * [格式化时间戳]
   * @param  {[number]} utcstr [时间戳]
   * @param  {[string]} format [时间格式，支持的格式自定义，需在该方法中配置]
   * @return {[string]}        [转化后的时间格式]
   */
  utils.formatDate = (utcstr, format = 'YYYY-MM-DD hh:mm:ss') => {
    let newDate
    if (!utcstr) {
      newDate = new Date()
    } else {
      if (mui.os.ios && typeof utcstr === 'string') {
        utcstr = utcstr.replace(/-/g, '/')
      }
      newDate = new Date(utcstr)
    }
    let year = newDate.getFullYear()
    let month = newDate.getMonth() + 1
    let dd = newDate.getDate()
    let hour = newDate.getHours()
    let min = newDate.getMinutes()
    let sec = newDate.getSeconds()

    return format
      .replace('YYYY', utils.operateTime(year))
      .replace('MM', utils.operateTime(month))
      .replace('DD', utils.operateTime(dd))
      .replace('hh', utils.operateTime(hour))
      .replace('mm', utils.operateTime(min))
      .replace('ss', utils.operateTime(sec))
  }

  utils.toFixed = (value, len = 2) => {
    return value ? parseFloat(value).toFixed(len) : 0
  }

  utils.getDay = (utcstr) => {
    let showDay = getSetting.SHOW_DAY
    let newDate
    if (utcstr) {
      if (mui.os.ios) {
        utcstr = utcstr.replace(/-/g, '/')
      }
      newDate = new Date(utcstr)
    } else {
      newDate = new Date()
    }
    return showDay[newDate.getDay()]
  }

  utils.getWeekOfYear = () => {
    let today = new Date()
    let firstDay = new Date(today.getFullYear(), 0, 1)
    let dayOfWeek = firstDay.getDay()
    let spendDay = 1
    if (dayOfWeek != 0) {
      spendDay = 7 - dayOfWeek + 1
    }
    firstDay = new Date(today.getFullYear(), 0, 1 + spendDay)
    var d = Math.ceil((today.valueOf()- firstDay.valueOf()) / 86400000)
    var result = Math.ceil(d / 7)
    return result + 1
  }

  utils.getUrlParam = (key, search = window.location.search) => {
    if (!key) {
      let param = {}
      search.replace(/([^=?&]*)=([^&]*)/g,
        (item, key, value) => {
          param[decodeURIComponent(key)] = decodeURIComponent(value)
          return param
        })
      return param
    }
    let pattern = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    let match = search.substr(1).match(pattern)
    return match !== null ? decodeURIComponent(match[2]) : null
  }

  utils.isEmptyObject = (obj) => {
    for (let key in obj) {
      return false
    }
    return true
  }

  /*
  * 深度copy
  */
  utils.deepCopy = (value) => {
    if (typeof value === 'object') {
      return JSON.parse(JSON.stringify(value))
    }
    return value
  }

  utils.px2rem = (value) => {
    if (!value) {
      return false
    }
    // return value
    let reKey = 2
    let reValue = value.replace(/\D/g, '')
    return parseInt(reValue)/reKey + 'px'
  }

  /*
   * 间隔格式转换
   * */
  utils.formatTime = (time, format) => {
    format = format || "min:sec"
    return format
      .replace("min", utils.operateTime(Math.floor(time / 60)))
      .replace("sec", utils.operateTime(Math.floor(time % 60)))
  }

  utils.operateTime = (time) => {
    return time < 10 ? '0' + time : time
  }

  /*
 * 间隔时间 intervalTime
 * */
  utils.intervalTime = (interval, format) => {
    format = format || "min:sec"
    return format
      .replace("min", utils.operateTime(Math.floor(interval / 60)))
      .replace("sec", utils.operateTime(Math.floor(interval % 60)))
    return format
  }

  utils.bytesToSize = (bytes) => {
    if (bytes === 0) return '0 B'
    let k = 1024
    let sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toPrecision(2) + ' ' + sizes[i]
  }

  utils.setpathname = (url) => {
    let pathname = window.location.pathname
    if (pathname.indexOf(/dist/) === -1) {
      return pathname + url
    }
    return pathname.replace(/\/dist\/.*/, url)
  }

  return utils
})

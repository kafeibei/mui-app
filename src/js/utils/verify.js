define(['config/config'], (getConfig) => {
  let verify = {}
  let regExpRules = {
    // 手机号正则检查
    phone: /^(1(3|7)[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
    number: /^\d+$/,
    http: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/,
    username: /^[A-Za-z]{1}[0-9A-Za-z_]{5,11}$/,
    password: /^[0-9A-Za-z_]{6,20}$/,
    email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
    idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    money: /^(\+)?\d+\.?\d{0,2}$/
  }

  /*
  * 验证 手机号
  * */
  verify.checkPhone = (str) => {
    if (regExpRules.phone.test(str)) {
      return str
    } else {
      return -1
    }
  }

  /*
 * 验证 密码
 * */
  verify.checkPassword = (str) => {
    if (regExpRules.password.test(str)) {
      return str
    } else {
      return -1
    }
  }

  /*
   * 验证 价格
   * */
  verify.checkMoney = (str) => {
    if (!str) {
      return ''
    }
    if (regExpRules.money.test(str)) {
      return str
    } else {
      return -1
    }
  }

  verify.checkNumber = (str) => {
    if (regExpRules.number.test(str)) {
      return str
    } else {
      return -1
    }
  }

  verify.checkIdCard = (str) => {
    if (!str) {
      return ''
    }
    if (regExpRules.idCard.test(str)) {
      return str
    } else {
      return -1
    }
  }

  verify.checkHttp = (str) => {
    if (!str) {
      return ''
    }
    if (regExpRules.http.test(str)) {
      return str
    } else {
      return -1
    }
  }

  return verify
})

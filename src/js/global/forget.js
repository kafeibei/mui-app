require(['vue', 'md5', 'components/navBar', 'api/login', 'utils/userinfo', 'utils/muiview', 'utils/verify', 'config/router'], (Vue, md5, navBar, api, userinfo, muiview, verify, defineRouter) => {
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '找回密码',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        timeoutCode: null,
        calcCount: 60,
        codeText: '获取验证码',
        module: 'member',
        form: {
          sid: '',
          mobile: '',
          password: '',
          vcode: ''
        },
        password: '',
        confirmPassword: '',
        existVcode: false,
      }
    },
    methods: {
      checkmobile (value) {
        return verify.checkPhone(value)
      },
      checkpassword (value) {
        return verify.checkPassword(this.form.password)
      },
      checkconfirmPassword () {
        if (this.form.confirmPassword !== this.form.password) {
          return -1
        }
        return false
      },
      getCode () {
        if (!this.form.mobile) {
          muiview.toast({
            message: '请输入手机号码',
            duration: 1500
          })
          return false
        } else if (verify.checkPhone(this.form.mobile) === -1) {
          muiview.toast({
            message: '手机号码格式错误',
            duration: 1500
          })
          return false
        }
        let apiMsgCode = api.msgCode({
          data: {
            mobile: this.form.mobile
          }
        }).then(res => {
          if (res) {
            this.calcCountdown()
            muiview.toast({
              message: '发送验证码成功',
              duration: 1500
            })
          }
        }, (rej) => {
          console.error('接口访问错误：' + rej.error_message)
          muiview.toast({
            message: rej.error_message,
            duration: 1500
          })
        })
      },
      calcCountdown () {
        this.existVcode = true
        this.timeoutCode = setTimeout(() => {
          this.calcCount--
          if (this.calcCount === 0) {
            this.timeoutCode && clearTimeout(this.timeoutCode)
            this.codeText = '重新获取'
            this.existVcode = false
            this.calcCount = 60
          } else {
            this.codeText = '还剩' + this.calcCount + 's'
            this.calcCountdown()
          }
        }, 1000)
      },
      validate () {
        let valid = {}
        if (!this.form.mobile) {
          valid.error_message = '请输入手机号码'
          valid.error_code = 'mobile'
        } else if (verify.checkPhone(this.form.mobile) === -1) {
          valid.error_message = '手机号格式错误'
          valid.error_code = 'mobile'
        } else if (!this.form.vcode) {
          valid.error_message = '请输入验证码'
          valid.error_code = 'vcode'
        } else if (!this.password || !this.confirmPassword) {
          valid.error_message = '请输入密码'
          valid.error_code = 'password'
        } else if (this.password !== this.confirmPassword) {
          valid.error_message = '两次输入的密码不一致'
          valid.error_code = 'password'
        } else if (verify.checkPassword(this.password) === -1) {
          valid.error_message = '密码格式错误'
          valid.error_code = 'password'
        }
        return valid.error_code ? Promise.reject(valid) : Promise.resolve()
      },
      next (event) {
        let $this = mui(event.target)
        $this.button('loading')
        this.validate()
          .then(_ => {
            this.submitForm($this)
          })
          .catch (rej => {
            muiview.toast({
              message: rej.error_message,
              onClose: () => {
                $this.button('reset')
              }
            })
          })
      },
      submitForm ($this) {
        this.form.password = window.md5(this.password).toUpperCase()
        muiview.toast({
          message: '修改密码成功',
          onClose: () => {
            userinfo.setUserInfo({
          		"ss": "abc1234%",
          		"registerStatus": 3,
          		"applyinfo": {
          			"condMap": {},
          			"provinceId": 1,
          			"cityId": 35,
          			"regionId": 379,
          			"province": "北京市",
          			"city": "北京市",
          			"region": "东城区",
          			"address": "何虎小店",
          			"userId": "1013988940494712832",
          			"applyStatus": 3,
          			"applyType": 2,
          			"companyType": "1",
          			"companyName": "何虎小店",
          			"fristBusiness": "何虎小店",
          			"secondBusiness": null,
          			"tradeForm": null,
          			"companyUrl": "www.***.com",
          			"personLiable": null,
          			"zip": null,
          			"contactPersonMobile": null,
          			"contactPerson": "何虎",
          			"birthday": null,
          			"sex": null,
          			"qq": "123456",
          			"email": "suchsun@163.com",
          			"tel": null,
          			"businessVolume": "0",
          			"photo": "saas/100/member/client/180703/180703b476d47dcf904aa7aec53cb202c838da.jpg",
          			"extinfo": null,
          			"remark": null,
          			"creator": null,
          			"createTime": 1530588833000,
          			"modifyPerson": null,
          			"modifyTime": 1530588833000,
          			"saasId": 100,
          			"mobile": null,
          			"registSource": null,
          			"registChannel": null,
          			"registTime": null
          		},
          		"userinfo": {
          			"userId": "1013988940494712832",
          			"mobile": "18969067660",
          			"name": "游客",
          			"saasId": null,
          			"memberLevelId": 100,
          			"profit": null,
          			"lastAccessTime": 0
          		},
          		"token": "MTAxMzk4ODk0MDQ5NDcxMjgzMiwxNTMwNjY4Mjc2MTUzLDIxOC43Ny4xMDYuMTI1LDEwMSwxMg==-BD66B55E2C23ACF126D6E3FBD7138FEC-ZsQMFPFh"
          	})
            $this.button('reset')
          }
        })
        setTimeout(() => {
          muiview.openWebview(defineRouter.login)
        }, 2000)
        return false
        api.forgetPwd({
          data: this.form
        }).then((res) => {
          if (res) {
            muiview.toast({
              message: '修改密码成功',
              duration: 1500,
              onClose: () => {
                userinfo.setUserInfo(res)
                $this.button('reset')
              }
            })
            setTimeout(() => {
              muiview.openWebview(defineRouter.login)
            }, 2000)
          }
        }).catch((rej) => {
          console.error('接口访问错误：' + rej.error_message)
          muiview.toast({
            message: rej.error_message,
            duration: 1500,
            onClose: () => {
              $this.button('reset')
            }
          })
        })
      }
    }
  })
})

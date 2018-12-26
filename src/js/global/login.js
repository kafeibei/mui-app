require(['vue', 'md5', 'api/login', 'config/router', 'config/config', 'config/userinfo', 'utils/userinfo', 'utils/muiview', 'utils/storage'], (Vue, md5, api, defineRouter, getConfig, curinfo, userinfo, muiview, storage) => {
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        form: {
          loginName: '11101002',
          password: ''
        },
        password: '666666',
        formLoading: false,
        formConfig: {
          type: 'password',
          hostHide: true,
          passwordHide: true,
          loginNameHide: true
        },
        selectionChecked: false
      }
    },
    methods: {
      onSubmit (event) {
        let $this = mui(event.target)
        $this.button('loading')
        let mockLogin = getConfig('mock').login
        if (mockLogin) {
          storage.set('loginName', this.form.loginName)
          this.submitBack(curinfo, $this)
          return false
        }
        if (!this.form.loginName || !this.password) {
          muiview.toast({
            message: '账号或密码不能为空',
            onClose: () => {
              $this.button('reset')
            }
          })
        } else {
          // this.form.password = window.md5(this.password).toUpperCase()
          this.form.password = this.password
          api.login({
            data: this.form
          }).then(res => {
            storage.set('loginName', this.form.loginName)
            this.submitBack(res, $this)
          }).catch(rej => {
            console.error('接口访问错误：' + rej.error_message)
            muiview.toast({
              message: rej.error_message,
              onClose: () => {
                $this.button('reset')
              }
            })
          })
        }
      },
      submitBack (data, $this) {
        muiview.toast({
          message: '登录成功',
          onClose: () => {
            userinfo.setUserInfo(data)
            muiview.openWebview(defineRouter.home)
            $this.button('reset')
          }
        })
      },
      goPage (type) {
        if (defineRouter[type]) {
          muiview.openWebview({
            url: defineRouter[type].url,
            id: defineRouter[type].id
          })
        } else {
          muiview.toast({
            message: '暂未配置该页面数据'
          })
        }
      },
      triggerchecked () {
        console.info('checked')
      },
      changeInput (type, value) {
        this.$set(this.formConfig, type + 'Hide', !value)
      }
    }
  })
})

define(['vue', 'utils/userinfo', 'utils/muiview', 'api/login', 'api/payment'], (Vue, userinfo, muiview, login, api) => {
  let hdpayView = () => {
    Vue.component('hdpay-sheet', {
      props: {
        options: Object,
        data: Object
      },
      template: `<div class="mui-popover-content mui-hdpay">
        <div class="mui-table-title hg-flex">
          <span class="btntext">&nbsp;</span>
          <h3 class="flex-one">支付确认</h3>
          <span class="btntext" @click="closeSheet">关闭</span>
        </div>
        <div class="mui-content">
          <p class="pay-tips">为了您账户资金安全，请输入验证码</p>
          <div class="mui-view mui-input-row">
            <input type="text" class="msgCode" name="msgCode" :placeholder="placeholder" v-model="detailInfo.msgCode" class="mui-input-clear" />
            <button type="button" class="mui-btn mui-btn-default mui-code" @click="getCode" :class="{'btn-disabled': existVcode}">{{codeText}}</button>
  				</div>
          <button type="button" class="mui-btn mui-btn-primary mui-btn-full" data-loading-icon="mui-spinner mui-spinner-white" data-loading-text="提交中" @click="onSubmit($event)">确定</button>
  			</div>
  		</div>`,
      data () {
        return {
          detailInfo: {},
          codeText: '获取验证码',
          placeholder: '',
          existVcode: false,
          calcCount: 60,
          timeoutCode: null
        }
      },
      created () {
        this.detailInfo.orderCode = this.data.ordercode
        this.userinfo()
      },
      methods: {
        userinfo () {
          let userInfo = userinfo.getUserInfo('userinfo') || {
            mobile: '15223456789'
          }
          let mobile = userInfo.mobile
          this.detailInfo.mobile = mobile
          this.placeholder = '发送手机 ' + (mobile.slice(0, 3) + '****' + mobile.slice(7, 11))
        },
        closeSheet () {
          if (this.timeoutCode) {
            clearTimeout(this.timeoutCode)
            this.timeoutCode = null
          }
          this.detailInfo.msgCode = ''
          this.codeText = '获取验证码'
          mui('#' + this.options.id).popover('toggle')
        },
        getCode () {
          if (this.existVcode) {
            return false
          }
          this.detailInfo.msgCode = ''
          api.shortmsgcode({
            data: {
              mobile: this.detailInfo.mobile,
              bizType: 51 // 订单支付标志
            }
          }).then(res => {
            if (res) {
              this.calcCountdown()
              muiview.toast({
                message: '发送验证码成功',
                duration: 1500
              })
              return false
            }
          }, (rej) => {
            console.error('接口访问错误：' + rej.error_message)
            muiview.toast({
              message: rej.error_message
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
        onSubmit (event) {
          if (!this.detailInfo.msgCode) {
            muiview.toast({
              message: '验证码不能为空'
            })
            return false
          }
          let $this = mui(event.target)
          $this.button('loading')
          api.balancepay({
            data: this.detailInfo
          }).then(res => {
            $this.button('reset')
            muiview.toast({
              message: '支付成功',
              onClose: () => {
                mui('#' + this.options.id).popover('toggle')
                this.$emit('finish')
              }
            })
          }).catch (rej => {
            console.error('接口访问错误：' + rej.error_message)
            muiview.toast({
              message: rej.error_message,
              onClose: () => {
                $this.button('reset')
              }
            })
          })
        }
      }
    })
  }
  return hdpayView
})

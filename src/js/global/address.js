require(['vue', 'components/navBar', 'config/router'], (Vue, navBar, defineRouter) => {
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '添加地址',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          },
          right: {
            title: '保存',
            action: this.doSave
          }
        },
        addressInfo: {
          province: '湖南省',
          city: '长沙市',
          area: '开福区',
          address: ''
        }
      }
    },
    created () {
    },
    methods: {
      onSubmit () {

      }
    }
  })
})

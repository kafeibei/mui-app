require(['vue', 'components/navBar', 'components/upload', 'utils/utils', 'utils/muiview'], (Vue, navBar, uploadImg, utils, muiview) => {
  navBar()
  uploadImg()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '上传图片',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        imageList: []
      }
    },
    created () {

    },
    methods: {

    }
  })
})

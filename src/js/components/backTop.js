define(['vue'], (Vue) => {
  let backTop = () => {
    Vue.component('back-top', {
      props: ['target'],
      template: `<div class="back-top" @click="backTop()" :class="{isShow: sideBarFixed}"></div>`,
      data () {
        return {
          sideBarFixed: '',
          showHeight: 0,
          scrollTimeout: null
        }
      },
      created () {
        this.showHeight = window.innerHeight/2
        setTimeout(() => {
          if (this.target) {
            document.getElementById(this.target).addEventListener('scroll', this.handleScroll)
          } else {
            window.addEventListener('scroll', this.handleScroll)
          }
        }, 800)
      },
      methods: {
        handleScroll () {
          if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout)
            this.scrollTimeout = null
          }
          this.scrollTimeout = setTimeout(() => {
            let scrollHeight = 0
            if (this.target) {
              scrollHeight = mui('#' + this.target).pullRefresh().y * (-1)
            } else {
              scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            }
            if(scrollHeight > this.showHeight) {
              this.sideBarFixed = true
            } else {
              this.sideBarFixed = false
              if (mui.os.android) {
                this.sideBarFixed = true
              }
            }
          }, 320)
        },
        // 返回顶部
        backTop () {
          if (this.target) {
            mui('#' + this.target).pullRefresh().scrollTo(0, 0, 300)
          } else {
            mui.scrollTo(0, 200)
          }
        }
      },
      beforeDestroy () {
        if (this.target) {
          document.getElementById(this.target).removeEventListener('scroll', this.handleScroll)
        } else {
          window.removeEventListener('scroll', this.handleScroll)
        }
      }
    })
  }
  return backTop
})

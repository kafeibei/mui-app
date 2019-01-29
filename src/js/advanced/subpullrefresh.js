require(['vue', 'components/widgetLoading', 'utils/utils', 'utils/muiview'], (Vue, widgetLoading, utils, muiview) => {
  widgetLoading()
  var ddVue = new Vue({
    el: '#subpage-container',
    data () {
      return {
        title: '下拉刷新和上拉加载',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        finish: false,
        errorCode: '',
        data: [],
        count: 20,
        page: 1
      }
    },
    created () {
      // 下拉刷新
      setTimeout(() => {
        muiview.pullRefresh('#pullrefresh', this.pullupRefresh, this.pulldownRefresh)
      }, 800)
      this.getList()
    },
    methods: {
      getList (cbk) {
        if (muiview.loading.isWaiting()) {
          return false
        }
        muiview.loading.show()
        setTimeout(() => {
          console.log('page', this.page)
          let old = this.count * (this.page - 1)
          let current = this.count * this.page
          for (let i = old; i < current; i++) {
            this.data.push({
              title: 'Item ' + (i + 1),
              name: 'Item ' + (i + 1)
            })
          }
          this.finish = true
          muiview.loading.close()
          cbk && cbk()
        }, 800)
      },
      pullupRefresh () {  // 加载更多
        console.info('加载更多', this.page)
        if (this.page < 3) {
          this.page ++
          this.getList(_ => {
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(this.page >= 3)
          })
        } else {
          mui('#pullrefresh').pullRefresh().endPullupToRefresh(this.page >= 3)
        }

      },
      pulldownRefresh () {
        console.info('上拉刷新')
        this.getList(_ => {
          mui('#pullrefresh').pullRefresh().endPulldownToRefresh()
        })
      }
    }
  })
})

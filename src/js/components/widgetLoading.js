define(['vue', 'utils/muiview', 'config/router'], (Vue, muiview, defineRouter) => {
  let widgetLoading = () => {
    Vue.component('widget-loading', {
      props: {
        finish: Boolean,
        errorcode: String,
        novalid: Boolean
      },
      template: `<div class="page-loading">
        <div class="loading-view" v-if="finish">
          <div class="invalid-code error-code" v-if="errorcode">
            <p>{{errorcode}}</p>
          </div>
          <div class="invalid-code empty-code" v-else-if="novalid">
            <p>未找到查询的数据~</p>
          </div>
          <div class="content-view" v-else><slot></slot></div>
        </div>
        <div v-else class="show-loading">加载中，请稍候。。。</div>
      </div>`,
      methods: {
        goPrimary () {
          muiview.openWebview(defineRouter.home)
        }
      }
    })
  }
  return widgetLoading
})

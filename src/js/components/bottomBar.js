define(['vue', 'config/bottomBar', 'utils/muiview', 'config/router'], (Vue, bottomBarConfig, muiview, defineRouter) => {
  let bottomBar = () => {
    Vue.component('bottom-bar', {
      props: ['active'],
      template: `<nav class="mui-bar mui-bottom-bar mui-bar-tab">
        <div class="mui-tab-list">
    			<div class="mui-tab-item"
           v-for="(item, index) in barList" :key="item.name" @tap.stop.prevent="activeBar(item, index)">
    				<p class="mui-tab-label" :class="['mui-' + item.name, {'mui-active': item.name === active}]">{{item.title}}</p>
    			</div>
        </div>
  		</nav>`,
      data () {
        return {
          barList: bottomBarConfig
        }
      },
      methods: {
        activeBar (item, $this) {
          if (item.name === this.active) {
            return false
          }
          muiview.openWebview({
            url: defineRouter[item.name].url,
            id: defineRouter[item.name].id,
            show: {
              aniShow: 'none'
            }
          })
        }
      }
    })
  }
  return bottomBar
})

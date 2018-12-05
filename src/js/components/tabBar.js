define(['vue', 'utils/utils'], (Vue, utils) => {
  let tabBar = () => {
    Vue.component('tab-bar', {
      props: ['active', 'data'],
      template: `<nav class="mui-bar mui-bar-tab mui-nav-bar">
        <div class="tab-bar-scroll mui-fixed-wrapper">
          <div class="mui-scroll">
      			<div class="mui-control-item"
             v-for="(item, index) in data" :key="index" :class="[{'mui-active': item.name === active}]" @tap.stop.prevent="activeBar(item, index)">
      				<span class="mui-tab-label">{{item.title}}</span>
      			</div>
          </div>
        </div>
  		</nav>`,
      methods: {
        activeBar (item, index) {
          this.active = item.name
          this.$emit('setactive', item, index)
        }
      }
    })
  }
  return tabBar
})

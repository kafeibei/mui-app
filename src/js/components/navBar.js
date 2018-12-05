define(['vue'], (Vue) => {
  let navBar = () => {
    Vue.component('nav-bar', {
      props: {
        title: String,
        config: Object
      },
      template: `<header id="header" class="mui-bar mui-bar-nav">
  			<span v-if="config && config.left" class="iconfont icon-arrow_left mui-action-back" :class="'mui-action-' + config.left.action"></span>
  			<h1 class="mui-title">{{title}}</h1>
        <button v-if="config && config.right" class="mui-btn mui-text-primary mui-btn-link mui-pull-right" :class="config.right.type ? ('mui-btn-' + config.right.type) : ''" @click="config.right.action">{{config.right.title}}</button>
  		</header>`
    })
  }
  return navBar
})

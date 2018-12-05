define(['vue'], (Vue) => {
  let hgMessage = () => {
    Vue.component('hg-message', {
      props: {
        title: String
      },
      template: `<div class="compontent-message">
    		<div class="message-content">
    			<img src="../../assets/bg.png" />
    			<div class="message-title">自定义-----{{title}}</div>
    		</div>
    	</div>`
    })
  }
  return hgMessage
})

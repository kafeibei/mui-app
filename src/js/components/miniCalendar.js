define(['vue', 'fulcalendar'], (Vue, fulcalendar) => {
  Vue.component("fullCalendar",fulcalendar);
  let miniCalendar = () => {
    Vue.component('mini-calendar', {
      props: ['data'],
      template: `<div class="mini-calendar">
  			<full-calendar :events="data" locale="zh_CN" @eventClick="eventClick"></full-calendar>
  		</div>`,
      methods: {
        eventClick (event, jsEvent, pos) {
          console.log('day', jsEvent, pos)
        }
      }
    })
  }
  return miniCalendar
})

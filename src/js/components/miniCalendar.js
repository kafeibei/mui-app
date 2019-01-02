define(['vue', 'fulcalendar', 'utils/utils'], (Vue, fulcalendar, utils) => {
  Vue.component("fullCalendar",fulcalendar);
  let miniCalendar = () => {
    Vue.component('mini-calendar', {
      props: ['data'],
      template: `<div class="mini-calendar">
  			<full-calendar :events="data" locale="zh_CN" @dayClick="dayClick"></full-calendar>
  		</div>`,
      methods: {
        dayClick (day, event) {
          let formatDate = utils.formatDate(day, 'YYYY-MM-DD hh:mm')
          this.$emit('dayclick', formatDate)
        }
      }
    })
  }
  return miniCalendar
})

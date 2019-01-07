define(['vue', 'fulcalendar', 'utils/utils'], (Vue, fulcalendar, utils) => {
  Vue.component("fullCalendar",fulcalendar);
  let miniCalendar = () => {
    Vue.component('mini-calendar', {
      props: ['data'],
      template: `<div class="mini-calendar">
  			<full-calendar :events="data" locale="zh_CN" @dayClick="dayClick" @changeMonth="changeMonth"></full-calendar>
  		</div>`,
      data () {
        return {
          curDay: '',
          curMonth: '',
          curClass: 'cur'
        }
      },
      created () {
        this.curDay = utils.formatDate(null, 'DD')
        this.faceMonth = utils.formatDate(null, 'MM')
        this.curMonth = this.faceMonth
        this.formatDate()
      },
      methods: {
        changeMonth (start, end, current) {
          this.faceMonth = utils.formatDate(current, 'MM')
          setTimeout(() => {
            this.filterClass()
          }, 50)
        },
        dayClick (day, event) {
          let target = event.target
          let className = target.className
          if (className.indexOf('not-cur-month') > -1) {
            return false
          }
          this.curDay = utils.formatDate(day, 'DD')
          this.curMonth = this.faceMonth
          this.filterClass()
          this.formatDate(day)
        },
        formatDate (day = null) {
          let formatDate = utils.formatDate(day, 'YYYY-MM-DD hh:mm')
          this.$emit('dayclick', formatDate)
        },
        filterClass () {
          let dayDom = document.getElementsByClassName('day-cell')
          for (let i = 0, len = dayDom.length; i < len; i++) {
            let curDom = dayDom[i]
            if (curDom.className.indexOf('not-cur-month') === -1) {
              curDom.className = 'day-cell'
              if (parseInt(curDom.innerText) === parseInt(this.curDay) && this.curMonth === this.faceMonth) {
                curDom.className += (' ' + this.curClass)
              }
            }
          }
        }
      }
    })
  }
  return miniCalendar
})

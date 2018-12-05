define(['utils/utils', 'utils/verify', 'config/router'], (utils, verify, defineRouter) => {
  let mixins = {
    data () {
      return {
        pageAnimated: false
      }
    },
    mounted () {
      this.pageAnimated = true
      if (this.reload && !this.no_reload_on_mount) {
        this.reload()
      }
    },
    methods: {}
  }
  mixins.methods.imgSrc = (indexpic, config) => {
    return indexpic
  },
  mixins.methods.formatTime = (time, type) => {
    return utils.formatDate(time, type)
  }
  return mixins
})

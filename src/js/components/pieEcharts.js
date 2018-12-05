define(['vue', 'echarts', 'utils/utils'], (Vue, _echarts, utils) => {
  let pieEcharts = () => {
    Vue.component('pie-echarts', {
      props: ['data', 'id', 'config'],
      template: `<div class="pie-echarts" :id="id"></div>`,
      data () {
        return {
          options: {
            title: {
              textStyle: {
                color: '#3D4D79',
                fontSize: '12',
                fontWeight: 'normal'
              }
            },
            calculable: false,
            color: ['#FF6E88', '#24DCB3', '#EFB645'],
            series: [{
              type: 'pie',
  						radius: ['50%', '70%'],
              itemStyle: {
                normal: {
                  borderWidth: 2,
        					borderColor: '#fff',
        					borderType: 'solid'
                }
      				}
            }]
          }
        }
      },
      created () {
        if (!this.id) {
          this.id = 'echart_' + utils.randomNum(4)
        }
        setTimeout(_ => {
          this.initEcharts()
        }, 800)
      },
      methods: {
        initEcharts () {
          let picChartDom = document.getElementById(this.id)
          let pieChart = window.echarts.init(picChartDom)
			    pieChart.setOption(this.echartOpts())
        },
        echartOpts () {
          this.options.series[0].data = []
          if (this.data && this.data[0]) {
            this.data.forEach(item => {
              this.options.series[0].data.push({
                value: item.amount,
                name: item.subjectTypeName
              })
            })
          }
          // this.options.title.text = this.config.name
          return this.options
        }
      }
    })
  }
  return pieEcharts
})

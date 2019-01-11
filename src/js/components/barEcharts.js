define(['vue', 'echarts'], (Vue, _echarts) => {
  let barEcharts = () => {
    Vue.component('bar-echarts', {
      props: ['data', 'id', 'config'],
      template: `<div class="echarts-canvas bar-echarts" :id="id"></div>`,
      data () {
        return {
          options: {
            color: ['#FF6E88', '#24DCB3', '#EFB645'],
  					legend: {},
  					grid: {
  						x: 45,
  						x2: 20,
  						y: 30,
  						y2: 30,
              borderColor: 'transparent'
  					},
  					calculable: false,
  					xAxis: {
  						type: 'category',
              axisLine: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisTick: {
                lineStyle: {
                  color: '#ccc'
                }
              }
  					},
  					yAxis: {
  						type: 'value',
              axisLine: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  color: ['#f0f0f0']
                }
              }
  					}
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
          let barChart = window.echarts.init(picChartDom)
			    barChart.setOption(this.echartOpts())
        },
        echartOpts () {
          if (this.data && this.data[0]) {
            this.options.series = []
            this.options.legend.data = []
            this.options.xAxis.data = this.data[0].key
            this.data.forEach(item => {
              this.options.legend.data.push(item.name)
              this.options.series.push({
                name: item.name,
    						type: 'bar',
    						data: item.value
              })
            })
          }
          return this.options
        }
      }
    })
  }
  return barEcharts
})

require(['vue', 'components/navBar', 'components/pieEcharts', 'components/barEcharts', 'components/lineEcharts', 'utils/muiview'], (Vue, navBar, pieEcharts, barEcharts, lineEcharts, muiview) => {
  pieEcharts()
  barEcharts()
  lineEcharts()
  navBar()
  var ddVue = new Vue({
    el: '#page-container',
    data () {
      return {
        title: '图表统计',
        navBarConfig: {
          left: {
            type: 'icon',
            action: 'back'
          }
        },
        pieEchartsData: [
          {
            value: 50,
            name: '香蕉'
          },
          {
            value: 250,
            name: '苹果'
          },
          {
            value: 138,
            name: '橙子'
          }
        ],
        barEchartsData: [
          {
            name: '苹果',
            value: [20, 5, 30, 12, 22, 40, 27, 65, 80, 9, 11, 87],
            key: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          {
            name: '橙子',
            value: [27, 65, 80, 9, 11, 87, 20, 5, 30, 12, 22, 40],
            key: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          }
        ]
      }
    }
  })
})

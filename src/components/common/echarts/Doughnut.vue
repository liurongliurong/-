<template>
  <div>
    <div :id="config.id" class="pie"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/lib/chart/pie'

export default {
  name: 'Doughnut',
  props: {
    config: {
      id: 'doughnutchart',
      xAxis: [],
      seriesData: []
    }
  },
  mounted () {
    this.drawLine()
  },
  watch: {
    'config.seriesData': function () {
      this.drawLine()
    }
  },
  methods: {
    drawLine () {
      let myChart = echarts.init(document.getElementById(this.config.id))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: true,
          orient: 'vertical',
          x: 'right',
          right: 50,
          top: 20,
          data: this.config.xAxis
        },
        series: [
          {
            name: '申请状态类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: this.config.seriesData
          }
        ]
      })
    }
  }
}
</script>

<style type="text/css" scoped>
.pie {
  height: 307px;
}
</style>


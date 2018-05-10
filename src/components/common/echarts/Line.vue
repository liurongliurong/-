<template>
  <div>
    <div :id="config.id" class="line"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/lib/chart/line'

export default {
  name: 'Line',
  props: {
    config: {
      id: 'linechart',
      dataType: [],
      xAxis: [],
      seriesData: {}
    }
  },
  watch: {
    'config.seriesData': function () {
      this.drawLine()
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      let myChart = echarts.init(document.getElementById(this.config.id))
      myChart.setOption({
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: '{a} <br/>{b}: {c}笔'
        },
        legend: {
          data: this.config.dataType
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.config.xAxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.config.dataType[0],
            type: 'line',
            stack: false,
            lineStyle: '#efeeff',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: {normal: {
              color: 'red'
            }},
            data: this.config.seriesData[this.config.dataType[0]]
          },
          {
            name: this.config.dataType[1],
            type: 'line',
            stack: false,
            lineStyle: '#fff5e6',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            areaStyle: {normal: {
              color: '#efeeff'
            }},
            data: this.config.seriesData[this.config.dataType[1]]
          }
        ]
      })
    }
  }
}
</script>

<style type="text/css" scoped>
.line {
  height: 307px;
}
</style>


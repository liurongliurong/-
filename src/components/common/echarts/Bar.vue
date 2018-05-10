<template>
  <div>
    <div :id="config.id" class="bar"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/lib/chart/bar'

export default {
  name: 'Bar',
  props: {
    config: {
      id: '',
      xAxis: [],
      seriesName: '',
      seriesData: [],
      unit: ''
    }
  },
  watch: {
    'config.seriesData': function () {
      this.drawLine()
    },
    'config.xAxis': function () {
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
        color: ['#F9A11E'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: `{a} <br/>{b}: {c}${this.config.unit}`
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
            data: this.config.xAxis,
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                let length = value.length
                let word = 5
                let row = Math.ceil(length / word)
                if (row > 1) {
                  let [start, end, temp, ret] = ['', '', '', '']
                  let last = row - 1
                  for (let i = 0; i < row; i++) {
                    start = i * word
                    end = start + word
                    temp = value.substring(start, end)
                    if (i !== last) {
                      temp += '\n'
                    }
                    ret += temp
                  }
                  return ret
                } else {
                  return value
                }
              }
            },
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.config.seriesName,
            type: 'bar',
            barWidth: '60%',
            data: this.config.seriesData
          }
        ]
      })
    }
  }
}
</script>

<style type="text/css" scoped>
.bar {
  height: 307px;
}
</style>


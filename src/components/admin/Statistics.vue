<template>
  <div class="statistics">
    <AdminHeader title="统计总览"></AdminHeader>
    <div class="container">
      <div class="static-form">
        <section v-for="item in form" class="item">
          <img :src="item.img">
          <aside>
            <p>
              <span class="count">{{item.value}}</span>
              <span class="unit">{{item.unit}}</span>
            </p>
            <router-link :to="{path:item.router,query:{status: item.status}}">
              <span class="name">{{item.name}}</span>
            </router-link>
          </aside>
        </section>
      </div>
      <div class="echart-lists">
        <div class="card">
          <header>税易贷申请状态类型</header>
          <article>
            <Doughnut :config='loanStatusConfig'></Doughnut>
          </article>
        </div>
        <div class="card">
          <header>贷款趋势</header>
          <article>
            <LineChart :config='loanTrendConfig'></LineChart>
          </article>
        </div>
        <div class="card">
          <header>税易贷放贷金额</header>
          <article>
            <Bar :config='loanAmountConfig'></Bar>
          </article>
        </div>
        <div class="card">
          <header>税易贷企业所属行业</header>
          <article>
            <Bar :config='loanTradeConfig'></Bar>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminHeader from './Header'
import Doughnut from '../common/echarts/Doughnut'
import LineChart from '../common/echarts/Line'
import Bar from '../common/echarts/Bar'
import { Status } from '../../share/orderStatus'

export default {
  name: 'Statistics',
  data () {
    return {
      manageLists: [],
      count: {},
      loanStatusConfig: {
        id: 'loanStatus',
        xAxis: ['待接收', '已接收', '同意贷款', '拒绝贷款', '已撤销'],
        seriesData: []
      },
      loanAmountConfig: {
        id: 'loanAmount',
        xAxis: [],
        seriesData: [],
        seriesName: '放贷金额',
        unit: '万元'
      },
      loanTrendConfig: {
        id: 'loanTrend',
        dataType: ['申请笔数', '放贷笔数'],
        xAxis: [],
        seriesData: {}
      },
      loanTradeConfig: {
        id: 'loanTrade',
        xAxis: [],
        seriesName: '企业数量',
        unit: ''
      },
      form: [
        {name: '待接收 >', unit: '笔', field: 'applied', img: require('@/assets/admin/statistic/icon-1.png'), router: '/admin/order-manage', value: '', status: 0},
        {name: '待审核 >', unit: '笔', field: 'accepted', img: require('@/assets/admin/statistic/icon-2.png'), router: '/admin/order-manage', value: '', status: 10},
        {name: '订单总数 >', unit: '笔', field: 'all', img: require('@/assets/admin/statistic/icon-3.png'), router: '/admin/order-manage', value: ''},
        {name: '发放贷款数 >', unit: '笔', field: 'agreed', img: require('@/assets/admin/statistic/icon-4.png'), router: '/admin/order-manage', value: '', status: 20}
      ],
      week: [
        {name: '周日', field: 'Sunday', key: 0},
        {name: '周一', field: 'Monday', key: 1},
        {name: '周二', field: 'Tuesday', key: 2},
        {name: '周三', field: 'Wednesday', key: 3},
        {name: '周四', field: 'Thursday', key: 4},
        {name: '周五', field: 'Friday', key: 5},
        {name: '周六', field: 'Saturday', key: 6}
      ],
      month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    }
  },
  created: function () {
    this.getLoanAmount() // 贷款金额
    this.getLoanStats()  // 贷款类型
    this.getLoanTrend()  // 趋势
    this.getLoanTrade()  // 行业
    this.getStatsCount()
  },
  methods: {
    getLoanStats () {
      this.api.get('/stats/loan/type').then((res) => {
        this.loanStatusConfig.seriesData = []
        for (let i = 0, len = res.data.length; i < len; i++) {
          this.loanStatusConfig.seriesData.push({
            value: Number.parseInt(res.data[i].count),
            name: Status.getOrderStatus(res.data[i].status)
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getLoanTrend () {
      this.api.get('/stats/loan/tendency').then((res) => {
        this.loanTrendConfig.seriesData = {}
        this.loanTrendConfig.xAxis = []
        let xAxis = []
        let seriesData = {}
        seriesData[this.loanTrendConfig.dataType[0]] = []
        seriesData[this.loanTrendConfig.dataType[1]] = []
        let today = new Date().getDay()
        for (let i = 0, iLen = this.week.length; i < iLen; i++) {
          for (let j = 0, len = this.week.length; j < len; j++) {
            if (today === this.week[j].key) {
              xAxis.unshift(this.week[j].name)
              seriesData[this.loanTrendConfig.dataType[0]].unshift(res.data['0'][this.week[j].field])
              seriesData[this.loanTrendConfig.dataType[1]].unshift(res.data['20'][this.week[j].field])
              break
            }
          }
          today -= 1
          if (today < 0) {
            today = 6
          }
        }
        this.loanTrendConfig.xAxis = xAxis
        this.loanTrendConfig.seriesData = seriesData
      }).catch(error => {
        console.log(error)
      })
    },
    getLoanTrade () {
      let showTrade = 6
      this.api.get(`/stats/loan/industry?top=${showTrade}`).then((res) => {
        this.loanTradeConfig.seriesData = []
        this.loanTradeConfig.xAxis = []
        let xAxis = []
        let seriesData = []
        for (let i = 0; i < showTrade; i++) {
          xAxis[i] = res.data[i] ? res.data[i]['trade'] : ''
          seriesData[i] = res.data[i] ? res.data[i]['count'] : 0
        }
        this.loanTradeConfig.xAxis = xAxis
        this.loanTradeConfig.seriesData = seriesData
      }).catch(error => {
        console.log(error)
      })
    },
    getLoanAmount () {
      this.api.get('/stats/loan/amount').then((res) => {
        let showMonth = 6
        let currentMonth = new Date().getMonth()
        let xAxis = []
        let seriesData = []
        for (let i = 0; i < showMonth; i++) {
          xAxis.push(this.month[currentMonth])
          for (let j = 0; j < showMonth; j++) {
            seriesData[j] = res.data[j] ? res.data[j]['sum'] : 0
          }
          currentMonth -= 1
          if (currentMonth < 0) {
            currentMonth = 11
          }
        }
        this.loanAmountConfig.seriesData = seriesData.reverse()
        this.loanAmountConfig.xAxis = xAxis.reverse()
      }).catch(error => {
        console.log(error)
      })
    },
    getStatsCount () {
      this.api.get('/stats/count').then((res) => {
        let result = res.data
        for (let i = 0, len = this.form.length; i < len; i++) {
          let field = this.form[i]['field']
          this.form[i].value = result[field]
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  components: {
    AdminHeader,
    Doughnut,
    LineChart,
    Bar
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/admin/statistics.scss';
</style>

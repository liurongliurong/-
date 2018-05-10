<template>
  <div class="order">
    <header>订单管理</header>
    <div class="filter">
      <div class="button-groups">
        <button v-for="item in filter" @click="getOrderLists(item.value)"
        :class="{'active-botton': item.value === status}">
          {{item.name}}
        </button>
      </div>
      <div class="search-input">
        <input type="text" placeholder="请输入查询条件" @keyup.enter="getOrderLists()" v-model="keyWord"/>
        <i @click="getOrderLists()"></i>
      </div>
    </div>
    <div class="table">
      <div class="thead">
        <span v-for="item in tableTitle" v-bind:style="{ width: item.width + '%'}">{{item.name}}</span>
      </div>
      <div class="tbody">
        <section v-for="item in orderLists" class="td">
          <span v-bind:style="{ width: '15%'}">{{item.sequence}}</span>
          <span v-bind:style="{ width: '20%'}">{{item.time}}</span>
          <span v-bind:style="{ width: '20%'}">{{item.target}}</span>
          <span v-bind:style="{ width: '10%'}">{{item.amount}}万元</span>
          <span v-bind:style="{ width: '10%'}">{{item.term}}个月</span>
          <span v-bind:style="{ width: '15%'}">{{getStatus(item.status)}}</span>
          <router-link v-bind:style="{ width: '10%'}" class="detail" :to="{ name: 'OrderDetails', query: { orderId: item.orderId }}">详情</router-link>
        </section>
      </div>
    </div>
  </div>

</template>

<script>
import { Status } from '../../share/orderStatus'

export default {
  name: 'Order',
  data () {
    return {
      keyWord: '',
      readProtocol: true,
      company: {},
      status: 1000,
      getStatus: Status.getOrderStatus,
      filter: [
        {name: '全部订单', value: 1000},
        {name: '待接收', value: 0},
        {name: '同意放款', value: 20},
        {name: '拒绝贷款', value: 21}
      ],
      tableTitle: [
        {name: '订单编号', width: '15'},
        {name: '贷款时间', width: '20'},
        {name: '贷款银行', width: '20'},
        {name: '贷款额度', width: '10'},
        {name: '贷款期限', width: '10'},
        {name: '状态', width: '15'},
        {name: '操作', width: '10'}
      ],
      orderLists: []
    }
  },
  created: function () {
    this.getOrderLists()
  },
  methods: {
    getOrderLists (value) {
      this.status = this.$route.query.status

      if (value || value === 0) {
        this.status = value
      }
      let data = {
        pageNumber: 1,
        pageSize: 10
      }

      if (value !== 1000) {
        data.status = this.status
      }
      if (typeof (this.status) === 'undefined') {
        this.status = 1000
      }

      if (this.keyWord) {
        data.keyword = this.keyWord
      }

      this.api.post('order/list', data).then((res) => {
        this.orderLists = res.data.result || []
      }).catch(error => {
        console.log(error)
      })
    }
  },
  components: {
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/personal/order.scss';
</style>

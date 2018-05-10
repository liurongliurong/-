<template>
  <div class="admin-user">
    <AdminHeader title="订单管理"></AdminHeader>
    <div class="search">
      <div class='button-group'>
        <button v-for="item in filter" @click="setStatus(item.value)"
        :class="{'active-botton': item.value === status}">
          {{item.name}}
        </button>
      </div>
      <div class="search-input">
        <input type="text" placeholder="请输入查询条件" @keyup.enter="getOrderLists()" v-model="keyWord"/>
        <i @click="getOrderLists()"></i>
      </div>
    </div>
    <div class="container">
      <div class="table">
        <div class="thead">
          <span v-for="item in tableTitle" v-bind:style="{ width: item.width + '%'}">{{item.name}}</span>
        </div>
        <div class="tbody">
          <section v-for="item in orderLists" class="td">
            <span v-bind:style="{ width: '10%'}">{{item.sequence}}</span>
            <span v-bind:style="{ width: '10%'}">{{item.userAccount}}</span>
            <span v-bind:style="{ width: '15%'}">{{item.enterpriseName}}</span>
            <span v-bind:style="{ width: '10%'}">{{item.amount}}万元</span>
            <span v-bind:style="{ width: '10%'}">{{item.term}}个月</span>
            <span v-bind:style="{ width: '13%'}">{{item.applyTime}}</span>
            <span v-bind:style="{ width: '12%'}">{{item.target}}</span>
            <span v-bind:style="{ width: '10%'}">{{getStatus(item.status)}}</span>
            <div class="button-group" v-bind:style="{ width: '10%'}">
              <router-link class="detail-button" :to="{ name: 'AdminOrderDetails', query: { orderId: item.orderId }}">详情</router-link>
            </div>
          </section>
        </div>
        <div class="tfoot">
          <span class="total-page">共{{pageConfig.totalPageCount}}页</span>
          <Pagination :config='pageConfig' @page="goToPage"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminHeader from './Header'
import Pagination from '../common/Pagination'
import { Status } from '../../share/orderStatus'

export default {
  name: 'OrderManage',
  data () {
    return {
      keyWord: '',
      totalPageCount: 0,
      currentPage: 1,
      status: 1000,
      getStatus: Status.getOrderStatus,
      pageConfig: {
        pageNo: 1,
        totalPageCount: 1,
        totalRecordCount: 1,
        pageSize: 10
      },
      tableTitle: [
        {name: '订单编号', width: '10'},
        {name: '注册账号', width: '10'},
        {name: '企业主体', width: '15'},
        {name: '贷款额度', width: '10'},
        {name: '贷款期限', width: '10'},
        {name: '申请时间', width: '13'},
        {name: '金融机构', width: '12'},
        {name: '业务状态', width: '10'},
        {name: '操作', width: '10'}
      ],
      filter: [
        {name: '全部订单', value: 1000},
        {name: '待接收', value: 0},
        {name: '已接收', value: 10},
        {name: '同意放款', value: 20},
        {name: '拒绝贷款', value: 21}
      ],
      orderLists: []
    }
  },
  created: function () {
    this.currentPage = 1
    if (this.$route.query.status === 0) {
      this.status = this.$route.query.status
    } else {
      this.status = this.$route.query.status || 1000
    }
    this.getOrderLists()
  },
  methods: {
    getOrderLists () {
      let data = {
        pageNumber: this.currentPage,
        pageSize: 10,
        keyword: this.keyWord
      }
      if (this.status !== 1000 && typeof (this.status) !== 'undefined') {
        data.status = this.status
      }

      this.api.post('manage/order/list', data).then((res) => {
        this.orderLists = res.data.result || []
        for (let key in this.pageConfig) {
          this.pageConfig[key] = res.data[key]
        }
        this.currentPage = res.data.pageNo
      }).catch(error => {
        console.log(error)
      })
    },
    setStatus (value) {
      if (value || value === 0) {
        if (value !== this.status) {
          this.currentPage = 1
        }
        this.status = value
      }
      this.getOrderLists()
    },
    goToPage (page) {
      if (page !== this.currentPage) {
        this.currentPage = page
        this.getOrderLists()
      }
    }
  },
  components: {
    AdminHeader,
    Pagination
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/admin/user.scss';
@import '../../stylesheets/admin/admin-common.scss';
</style>

<template>
  <div class="admin-user">
    <AdminHeader title="注册用户"></AdminHeader>
    <div class="search">
      <span></span>
      <div class="search-input">
        <input type="text" placeholder="请输入查询条件" @keyup.enter="getUserLists()" v-model="keyWord"/>
        <i @click="getUserLists()"></i>
      </div>
    </div>
    <div class="container">
      <div class="table">
        <div class="thead">
          <span v-for="item in tableTitle" v-bind:style="{ width: item.width + '%'}">{{item.name}}</span>
        </div>
        <div class="tbody">
          <section v-for="item in userLists" class="td">
            <span v-bind:style="{ width: '20%'}">{{item.userAccount || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.enterpriseName || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.enterpriseUscc || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.representName || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.representMobile || "──"}}</span>
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

export default {
  name: 'AdminUser',
  data () {
    return {
      keyWord: '',
      readProtocol: true,
      company: {},
      status: 100,
      totalPageCount: 0,
      currentPage: 1,
      pageConfig: {
        pageNo: 1,
        totalPageCount: 1,
        totalRecordCount: 1,
        pageSize: 10
      },
      filter: [
        {name: '全部订单', value: 100},
        {name: '待接收', value: 10},
        {name: '同意放款', value: 20},
        {name: '不同意放款', value: 21}
      ],
      tableTitle: [
        {name: '注册账号', width: '20'},
        {name: '申请主体', width: '20'},
        {name: '统一社会信用代码', width: '20'},
        {name: '法人代表', width: '20'},
        {name: '法人代表手机号', width: '20'}
      ],
      userLists: []
    }
  },
  created: function () {
    this.status = 100
    this.getUserLists()
  },
  methods: {
    getUserLists () {
      let data = {
        params: {
          pageNumber: this.pageConfig.pageNo,
          pageSize: 10
        }
      }
      if (this.keyWord !== '') {
        data.params.keyword = this.keyWord
      }
      this.api.get('manage/user/list', data).then((res) => {
        this.userLists = res.data.result || []
        for (let key in this.pageConfig) {
          this.pageConfig[key] = res.data[key]
        }
      }).catch(error => {
        console.log(error)
      })
    },
    goToPage (page) {
      if (page !== this.currentPage) {
        this.currentPage = page
        this.getUserLists()
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
</style>

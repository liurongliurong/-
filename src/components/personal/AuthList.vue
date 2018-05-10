<template>
  <div class="order">
    <header>资料认证</header>
    <!-- <div class="filter">
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
    </div> -->
    <router-link to="/personal/auth">
      <button>添加企业</button>
    </router-link>
    <div class="table">
      <div class="thead">
        <span v-for="item in tableTitle" v-bind:style="{ width: item.width + '%'}">{{item.name}}</span>
      </div>
      <div class="tbody">
        <section v-for="item in companyLists" class="td">
          <span v-bind:style="{ width: '35%'}">{{item.fullName}}
            <span class="auth-tips">已认证</span>
          </span>
          <span v-bind:style="{ width: '25%'}">{{item.uscc}}</span>
          <span v-bind:style="{ width: '15%'}">{{item.representName}}</span>
          <span v-bind:style="{ width: '25%'}">{{item.representNric}}</span>
          <!-- <span v-bind:style="{ width: '10%'}" class="detail">删除</span> -->
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
      tableTitle: [
        {name: '公司', width: '35'},
        {name: '统一社会信用代码', width: '25'},
        {name: '法人代表', width: '15'},
        {name: '法人代表身份证号', width: '25'}
        // {name: '操作', width: '10'}
      ],
      companyLists: []
    }
  },
  created: function () {
    this.getOrderLists()
    this.getEnterpriseList()
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
    },
    getEnterpriseList () {
      let data = {
        pageNumber: 1,
        pageSize: 10
      }
      this.api.post('enterprise/list', data).then((res) => {
        this.companyLists = res.data.result
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
@import '../../stylesheets/personal/common.scss';

.auth-tips {
  font-style: normal;
  box-sizing: border-box;
}

button {
  margin: 20px 0;
}
</style>

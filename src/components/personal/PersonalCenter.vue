<template>
  <div class="personal-center">
    <header>个人中心</header>
    <main>
      <section>
        <header>
          <span>企业资料管理</span>
        </header>
        <article v-if="!isAuth">
          <p class="auth-introduce">
            企业通过税易贷平台申请税银贷，需要登记纳税人的基本信息，通过平台提交至所在地税务部门确认、核实资料真实性。
          </p>
          <router-link to="/personal/auth">
            <button>立即认证</button>
          </router-link>
        </article>
        <article v-if="isAuth" class="auth-info">
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
              </section>
            </div>
          </div>
        </article>
      </section>
      <section>
        <header>贷款申请</header>
        <article>
          <router-link to="/personal/loan-apply">
            <button class="apply">立即申请</button>
          </router-link>
        </article>
      </section>
      <section>
        <header>订单管理
          <router-link to="/personal/order"><span class="sub">全部订单></span></router-link>
        </header>
        <article class="order-lists">
          <div v-for="item in orderLists" @click="goToOrderManage(item.status)">
            <img :src="item.img" />
            <span>{{item.name}}</span>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>

export default {
  name: 'PersonalCenter',
  data () {
    return {
      enterprise: {},
      isAuth: false,
      orderLists: [
        {name: '待接收', img: require('@/assets/personal/icon-receive.png'), status: 0},
        {name: '同意放款', img: require('@/assets/personal/icon-agree.png'), status: 20},
        {name: '拒绝贷款', img: require('@/assets/personal/icon-deny.png'), status: 21}
      ],
      authInfo: [
        {name: '统一社会信用代码', field: 'uscc', value: ''},
        {name: '法人代表', field: 'representName', value: ''},
        {name: '法人代表身份证号', field: 'representNric', value: ''}
      ],
      tableTitle: [
        {name: '公司', width: '35'},
        {name: '统一社会信用代码', width: '25'},
        {name: '法人代表', width: '15'},
        {name: '法人代表身份证号', width: '25'}
      ],
      companyLists: []
    }
  },
  created: function () {
    this.getEnterpriseList()
  },
  methods: {
    getEnterpriseList () {
      let data = {
        pageNumber: 1,
        pageSize: 10
      }
      this.api.post('enterprise/list', data).then((res) => {
        this.companyLists = res.data.result
        this.isAuth = this.companyLists.length > 0
      }).catch(error => {
        console.log(error)
      })
    },
    goToOrderManage (value) {
      this.$router.push({
        path: '/personal/order',
        query: {
          status: value
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/personal/personal-center.scss';
</style>

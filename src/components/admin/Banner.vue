<template>
  <div class="admin-banner">
    <header>
      <router-link to='/admin/statistics'>
        <div class="logo">
          <img src="../../assets/common/logo-t.png"/>
          <div>
            <h2 class="name">税易贷</h2>
            <span class="address">anji.shuiyidai.com.cn</span>
          </div>
        </div>
      </router-link>
    </header>
    <nav>
      <li v-for="item in nav" @mouseenter="item.active=!item.active" @mouseleave="item.active=!item.active">
        <router-link :class="['nav-item', {'nav-active':$route.path.includes(item.link)}]" :to="item.link">
          <i class="iconfont" :class="[item.icon]"></i>
          {{item.name}}
        </router-link>
      </li>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AdminBanner',
  data () {
    return {
      nav: [
        {name: '统计总览', link: '/admin/statistics', icon: 'icon-statistics', active: false},
        {name: '注册用户', link: '/admin/register-user', icon: 'icon-register-user', active: false},
        {name: '订单管理', link: '/admin/order-manage', icon: 'icon-order-manage', active: false},
        {name: '用户管理', link: '/admin/user-manage', icon: 'icon-user-manage', active: false},
        {name: '银行人员', link: '/admin/bank-clerk', icon: 'icon-bank-user', active: false}
      ]
    }
  },
  created: function () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      if (this.model !== 'login') {
        this.api.get('/manager/info').then((res) => {
          if (res.data.bankId) {
            let disabled = ['icon-register-user', 'icon-user-manage']
            this.nav = this.nav.filter((item) => {
              return !disabled.includes(item.icon)
            })
          } else {
            let disabled = ['icon-bank-user']
            this.nav = this.nav.filter((item) => {
              return !disabled.includes(item.icon)
            })
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/admin/banner.scss';
</style>
<template>
  <div class="personal-banner">
    <header><router-link to='/personal'>个人中心</router-link></header>
    <nav>
      <li v-for="item in nav" @mouseenter="item.active=!item.active" @mouseleave="item.active=!item.active">
        <router-link :class="['nav-item', {'nav-active': $route.path.includes(item.link)}]" :to="item.link">
          <img :src="item.activeImg" v-if="item.active || $route.path.includes(item.link)"/>
          <img :src="item.img" v-else />
          {{item.name}}
        </router-link>
      </li>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'PersonBanner',
  data () {
    return {
      nav: [
        {name: '资料认证', link: '/personal/auth/list', img: require('@/assets/personal/icon3.png'), activeImg: require('@/assets/personal/icon3n.png'), active: false},
        {name: '贷款申请', link: '/personal/loan-apply', img: require('@/assets/personal/icon1.png'), activeImg: require('@/assets/personal/icon1n.png'), active: false},
        {name: '订单管理', link: '/personal/order', img: require('@/assets/personal/icon2.png'), activeImg: require('@/assets/personal/icon2n.png'), active: false}
      ]
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/personal/banner.scss';
</style>

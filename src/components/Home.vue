<template>
  <div class="home">
    <div class="banner">
      <HeaderItem></HeaderItem>
    </div>
    <div class="card">
      <header>快捷入口</header>
      <article class="item-lists">
        <div v-for="item in entrance" class="item">
          <aside>
            <span class="item-name">{{item.name}}</span>
            <span class="item-introduce">{{item.introduce}}</span>
            <span class="item-show">立即查看<i class="arrow"></i></span>
          </aside>
          <img v-bind:src="item.img" />
        </div>
      </article>
    </div>
    <FooterItem></FooterItem>
  </div>
</template>

<script>
import HeaderItem from './common/Header'
import FooterItem from './common/Footer'

export default {
  name: 'Home',
  data () {
    return {
      entrance: [
        {name: '企业认证与授权', introduce: '介绍文字介绍文字介绍文字介绍文字介绍文字介绍文字介绍文字介绍文字介绍文字介绍', img: require('@/assets/home/img1.png')},
        {name: '订单管理', introduce: '介绍文字介绍文字介绍文字介绍文字介绍文字介绍文字介绍文字介绍文字介绍文字介绍', img: require('@/assets/home/img2.png')}
      ]
    }
  },
  components: {
    HeaderItem,
    FooterItem
  }
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/home.scss';
</style>

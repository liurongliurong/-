<template>
  <div class="partner">
    <header>合作伙伴</header>
    <article class="item-lists">
      <div v-for="item in partner" @mouseenter="item.active=!item.active" @mouseleave="item.active=!item.active">
        <img v-bind:src="item.img" v-if="!item.active"/>
        <img v-bind:src="item.activeImg" v-if="item.active"/>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'Partner',
  data () {
    return {
      partner: [
        { img: require('@/assets/common/baoquan.png'), activeImg: require('@/assets/common/n-baoquan.png'), active: false },
        { img: require('@/assets/common/baoquan.png'), activeImg: require('@/assets/common/n-baoquan.png'), active: false },
        { img: require('@/assets/common/baoquan.png'), activeImg: require('@/assets/common/n-baoquan.png'), active: false },
        { img: require('@/assets/common/baoquan.png'), activeImg: require('@/assets/common/n-baoquan.png'), active: false },
        { img: require('@/assets/common/baoquan.png'), activeImg: require('@/assets/common/n-baoquan.png'), active: false }
      ]
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/common/partner.scss';
</style>
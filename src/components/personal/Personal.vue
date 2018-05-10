<template>
  <div class="personal">
    <HeaderItem></HeaderItem>
    <div class="content">
      <main>
        <div class="left">
          <PersonBanner></PersonBanner>
        </div>
        <div class="right">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <FooterItem></FooterItem>
  </div>
</template>

<script>
import PersonBanner from './Banner'
import HeaderItem from '../common/Header'
import FooterItem from '../common/Footer'

export default {
  name: 'Personal',
  data () {
    return {
    }
  },
  components: {
    PersonBanner,
    HeaderItem,
    FooterItem
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/personal/personal.scss';
</style>

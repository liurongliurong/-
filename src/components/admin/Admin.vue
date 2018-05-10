<template>
  <div class="admin-user">
    <AdminBanner class="left"></AdminBanner>
    <router-view class="right"></router-view>
  </div>
</template>

<script>
import AdminBanner from './Banner'
export default {
  name: 'Admin',
  components: {
    AdminBanner
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/admin/admin.scss';
</style>

<template>
  <div class="pagination">
    <ul v-if="config.totalPageCount >= 1">
      <li @click="goPage(config.pageNo, 'back')" >
        <a><</a>
      </li>
      <li v-for="index in config.totalPageCount" @click="goPage(index, 'go')"
      :class="{'active':config.pageNo == index}" :key="index">
        <a>{{index}}</a>
      </li>
      <li @click="goPage(config.pageNo, 'next')">
        <a>></a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  methods: {
    goPage (page, action) {
      switch (action) {
        case 'back':
          if (page > 1) {
            page--
          }
          break
        case 'go':
          break
        case 'next':
          if (page < this.config.totalPageCount) {
            page++
          }
          break
        default:
          break
      }
      this.config.pageNo = page
      this.$emit('page', this.config.pageNo)
    }
  },
  props: {
    config: {
      pageNo: 1,
      totalPageCount: 1,
      totalRecordCount: 1,
      pageSize: 10
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/common/pagination.scss';
</style>
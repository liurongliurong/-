<template>
  <div class="footer" :style="{'border-top':model === 'personal'? '0' : 'solid 1px #999'}">
    <div class="content">
      <!-- <p class="phone">
        <i class="icon-call"></i>
        客服热线：<span class="phone-num">{{phone}}</span>
      </p> -->
      <span>浙ICP备023950023号</span>
    </div>
  </div>
</template>

<script>
import { Config } from '../../../config/default'

export default {
  name: 'Footer',
  data () {
    return {
      phone: Config.phone,
      model: 'login'
    }
  },
  created: function () {
    this.getPageModel()
  },
  methods: {
    getPageModel () {
      let routeList = ['login', 'register', 'change-password', 'tos']
      for (let i = 0, len = routeList.length; i < len; i++) {
        if (this.$route.path.includes(routeList[i])) {
          this.model = 'login'
          return
        }
      }
      this.model = 'personal'
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/common/footer.scss';
</style>

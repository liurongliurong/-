<template>
  <div :class="['header',{'personal':model === 'personal'}]">
    <main>
      <router-link to='/'>
        <div class="left">
          <img src="../../assets/common/logo.png"/>
          <div>
            <h2 class="name">税易贷</h2>
            <span class="address">anji.shuiyidai.com.cn</span>
          </div>
        </div>
      </router-link>
      <div class="right" v-if="model === 'personal'">
        <i class="icon-user"></i>
        <span>{{phone}}</span>
        <span class="sign-out" @click="signOut()">退出</span>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      model: 'login',
      phone: ''
    }
  },
  props: {
    pageType: String
  },
  created: function () {
    this.getPageModel()
    this.getUserInfo()
  },
  methods: {
    signOut () {
      localStorage.removeItem('token')
      localStorage.setItem('logged', false)
      this.$router.push({path: '/login'})
    },
    getPageModel () {
      let routeList = ['login', 'register', 'change-password', 'tos']
      for (let i = 0, len = routeList.length; i < len; i++) {
        if (this.$route.path.includes(routeList[i])) {
          this.model = 'login'
          return
        }
      }
      this.model = 'personal'
    },
    getUserInfo () {
      if (this.model !== 'login') {
        this.api.get('user/info').then((res) => {
          this.phone = res.data.account
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/common/header.scss';
</style>

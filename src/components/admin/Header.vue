<template>
  <div class="admin-header">
    <span class="title">{{title}}</span>
    <div class="right">
      <section class="user-info">
        <i class="icon-user"></i>
        <span class="user-name">{{name}}</span>
        <div class="user-info-nav">
          <router-link :to="{path: '/admin/user-manage/detail/edit', query: { id: userId }}">个人信息</router-link>
        </div>
      </section>
      <section class="sign-out" @click="signOut()">
        <i class="icon-exit"></i>
        <span>退出</span>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AdminHeader',
  data () {
    return {
      model: 'login',
      name: ''
    }
  },
  props: {
    title: String
  },
  created: function () {
    this.getPageModel()
    this.getUserInfo()
  },
  computed: {
    ...mapState({
      userId: function (state) {
        if (!state.adminUserInfo.id) {
          this.$store.commit('ADMIN_GET_INFO')
        }
        return state.adminUserInfo.id
      }
    })
  },
  methods: {
    signOut () {
      localStorage.removeItem('token')
      localStorage.setItem('logged', false)
      this.$router.push({path: '/admin/login'})
    },
    getPageModel () {
      let routeList = ['login']
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
        this.api.get('/manager/info').then((res) => {
          this.name = res.data.name
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/admin/header.scss';
</style>

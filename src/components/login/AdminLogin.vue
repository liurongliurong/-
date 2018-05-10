<template>
  <div class="login">
    <main>
      <HeaderItem></HeaderItem>
      <div class="frame">
        <header>用户登录</header>
        <div class="content">
          <div v-for="item in form">
            <section>
              <i :class="item.class"></i>
              <input :type="item.type" v-model="info[item.value]" @keyup.enter = "login()"
              v-on:blur="getValitor(item.value)" :placeholder="item.tips"/>
            </section>
            <Hint v-if="!item.valitor" :text='item.tips'></Hint>
          </div>
          <button @click="login()">立即登录</button>
          <PromptBox v-if="showPromptBox" @submit="fromPromptBox" model='tips' :text='PromptBoxText'></PromptBox>
        </div>
      </div>
      <FooterItem></FooterItem>
    </main>
  </div>
</template>

<script>
import HeaderItem from '../common/Header'
import FooterItem from '../common/Footer'
import { Valitor } from '../../share/validation'
import PromptBox from '../common/PromptBox'
import Hint from '../common/Hint'

export default {
  name: 'AdminLogin',
  data () {
    return {
      info: {},
      showPromptBox: false,
      PromptBoxText: '',
      form: [
        {value: 'account', valitor: true, tips: '请输入账号', type: 'text', class: 'phone'},
        {value: 'password', valitor: true, tips: '请输入正确的密码', type: 'password', class: 'lock'}
      ]
    }
  },
  methods: {
    login () {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (!this.form[i].valitor || this.info[this.form[i].value] === '' || typeof (this.info[this.form[i].value]) === 'undefined') {
          this.form[i].valitor = false
          return
        }
      }

      let data = {
        params: this.info
      }

      this.api.get('manager/login', data).then((res) => {
        if (!res['code']) {
          localStorage.setItem('logged', true)
          this.$store.dispatch('getAdminUserInfo')
          this.$router.push({path: '/admin/statistics'})
        } else {
          this.PromptBoxText = res.msg
          this.showPromptBox = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getValitor (value) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'account':
              this.form[i].valitor = this.info[value] !== '' && typeof (this.info[value]) !== 'undefined'
              break
            case 'password':
              // this.form[i].valitor = Valitor.passwordValitor(this.info[value])
              this.form[i].valitor = this.info[value] !== '' && typeof (this.info[value]) !== 'undefined'
              break
            default:
              break
          }
          break
        }
      }
    },
    fromPromptBox (msg) {
      this.showPromptBox = msg !== 'success'
    }
  },
  components: {
    HeaderItem,
    FooterItem,
    Valitor,
    PromptBox,
    Hint
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/login/login.scss';
</style>

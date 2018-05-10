<template>
  <div class="login">
    <main>
      <HeaderItem></HeaderItem>
      <div class="frame">
        <header>欢迎登录税易贷</header>
        <div class="content">
          <div v-for="item in form">
            <section>
              <i :class="item.class"></i>
              <input :type="item.type" v-model="info[item.value]" @keyup.enter = "login()"
              v-on:blur="getValitor(item.value)" v-on:input="getValitor(item.value, 'input')" :placeholder="item.placeholder" @keyup="getKeyup(item.value)"
              :maxLength="item.maxLength" :id="item.value"/>
            </section>
            <Hint v-if="!item.valitor" :text='item.tips'></Hint>
          </div>
          <button @click="login()">立即登录</button>
          <div class="button-group">
            <router-link class="hover-blue" to="/register">免费注册</router-link>
            <hr>
            <router-link class="hover-blue" to="/change-password">忘记密码?</router-link>
          </div>
          <PromptBox v-if="showPromptBox" @submit="fromPromptBox" model='tips' text='用户名或密码错误'></PromptBox>
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
  name: 'Login',
  data () {
    return {
      info: {},
      showPromptBox: false,
      form: [
        {value: 'mobile', valitor: true, placeholder: '请输入手机号', tips: '请输入正确的手机号', type: 'text', class: 'phone', maxLength: 11},
        {value: 'password', valitor: true, placeholder: '请输入密码', tips: '请输入正确的密码', type: 'password', class: 'lock', maxLength: 18}
      ]
    }
  },
  methods: {
    login () {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (!this.form[i].valitor || this.info[this.form[i].value] === '' || typeof (this.info[this.form[i].value]) === 'undefined') {
          this.form[i].valitor = false
          document.getElementById(this.form[i].value).focus()
          return
        }
      }

      let data = {
        params: this.info
      }

      this.api.get('user/login', data).then((res) => {
        if (!res['code']) {
          localStorage.setItem('logged', true)
          this.$router.push({path: '/personal'})
        } else {
          this.showPromptBox = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getValitor (value, action) {
      if (action === 'input') {
        for (let i = 0, len = this.form.length; i < len; i++) {
          if (this.form[i].value === value && this.form[i].valitor) {
            return
          }
        }
      }
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'mobile':
              this.form[i].valitor = Valitor.phoneValitor(this.info[value])
              break
            case 'password':
              this.form[i].valitor = Valitor.passwordValitor(this.info[value])
              break
            default:
              break
          }
          break
        }
      }
    },
    getKeyup (value) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'mobile':
              this.info[value] = Valitor.numberValitor(this.info[value])
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

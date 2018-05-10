<template>
  <div class="login">
    <main class="register">
      <HeaderItem></HeaderItem>
      <div class="frame">
        <header>{{reg ? '欢迎注册税易贷' : '修改密码'}}</header>
        <div class="content">
          <div v-for="item in form">
            <section v-if="item.value !== 'verifyCode'">
              <i :class="item.class"></i>
              <input :type="item.type" v-model="info[item.value]" @keyup.enter = "regOrReset()"
              v-on:blur="getValitor(item.value)" v-on:input="getValitor(item.value, 'input')" :placeholder="item.placeholder" v-if="item.value !== 'mobile'"
              :maxLength="item.maxLength" :id="item.value" @keyup="getKeyup(item.value)"/>
              <input :type="item.type" v-model="info[item.value]" v-if="item.value === 'mobile'"
              v-on:input ="getValitor(item.value, 'input')" v-on:blur ="getValitor(item.value)"
              :placeholder="item.placeholder" :maxLength="item.maxLength" :id="item.value" @keyup="getKeyup(item.value)"/>
            </section>
            <div v-if="item.value === 'verifyCode'" class='verify-section'>
              <section>
                <i :class="item.class"></i>
                <input :type="item.type" v-model="info[item.value]" @keyup.enter = "regOrReset()"
                v-on:blur="getValitor(item.value)" v-on:input ="getValitor(item.value, 'input')" :placeholder="item.placeholder" v-if="item.value !== 'mobile'"
                :maxLength="item.maxLength" :id="item.value" @keyup="getKeyup(item.value)"/>
              </section>
              <button v-if="item.value === 'verifyCode'" class="verification"
                :disabled="second > 0 || !mobileValitor" @click="checkMobile()">发送验证码{{second > 0?second+'S':''}}</button>
            </div>
            <Hint v-if="!item.valitor" :text='item.tips'></Hint>
          </div>
          <div class="read" v-if="reg">
            <i :class="['circle',{'right':readProtocol}]" @click="readProtocol = !readProtocol"></i>我已阅读并同意<span class="blue" @click="showTosBox = true">《税易贷服务协议》</span>
          </div>
          <button @click="submit()" :disabled="!readProtocol" >{{reg ? '立即注册' : '修改密码'}}</button>
          <div class="button-group">
            <span>已有账号,</span>
            <router-link class="blue" to="/login">立即登录</router-link>
          </div>
        </div>
      </div>
      <PromptBox v-if="showPromptBox" @submit="fromToPrompt" model='tips' :text="PromptBoxText"></PromptBox>
      <TosBox v-if="showTosBox" @submit="fromTosBox" article='service' ></TosBox>
      <FooterItem></FooterItem>
    </main>
  </div>
</template>

<script>
import HeaderItem from '../common/Header'
import FooterItem from '../common/Footer'
import { Valitor } from '../../share/validation'
import Hint from '../common/Hint'
import PromptBox from '../common/PromptBox'
import TosBox from '../common/TosBox'

export default {
  name: 'Register',
  data () {
    return {
      valitor: {
        password: true,
        confirmPassword: true
      },
      info: {},
      reg: false,
      readProtocol: true,
      second: 0,
      PromptBoxText: '',
      showPromptBox: false,
      showTosBox: false,
      mobileValitor: false,
      regSuccess: false,
      form: [
        {value: 'mobile', valitor: true, placeholder: '请输入手机号', tips: '请输入正确的手机号', type: 'text', class: 'phone', maxLength: 11},
        {value: 'verifyCode', valitor: true, placeholder: '请输入验证码', tips: '请输入验证码', type: 'text', class: 'message', maxLength: 4},
        {value: 'password', valitor: true, placeholder: '请输入6到18位数字加字母的密码', tips: '请输入6到18位数字加字母的密码', type: 'password', class: 'lock', maxLength: 18},
        {value: 'confirmPassword', valitor: true, placeholder: '请重复输入密码', tips: '两次输入的密码不一致', type: 'password', class: 'lock', maxLength: 18}
      ]
    }
  },
  created () {
    this.reg = this.isRegisterPage()
  },
  methods: {
    isRegisterPage () {
      return this.$route.path.includes('register')
    },
    regOrReset () {
      let url = this.reg ? '/user/register' : '/user/resetPassword'

      let data = {
        params: {
          mobile: this.info['mobile'],
          password: this.info['password'],
          verifyCode: this.info['verifyCode']
        }
      }

      this.api.get(url, data).then((res) => {
        if (!res.code) {
          this.regSuccess = true
          this.showPromptBox = true
          this.PromptBoxText = this.reg ? '注册成功' : '修改密码成功'
        } else if (res.code === 1) {
          this.showPromptBox = true
          this.PromptBoxText = res.msg
        }
      }).catch(error => {
        console.log(error)
      })
    },
    submit () {
      if (this.reg) {
        for (let i = 0, len = this.form.length; i < len; i++) {
          if (!this.form[i].valitor || this.info[this.form[i].value] === '' || typeof (this.info[this.form[i].value]) === 'undefined') {
            this.form[i].valitor = false
            document.getElementById(this.form[i].value).focus()
            return
          }
        }
        this.showTosBox = true
      } else {
        this.regOrReset()
      }
    },
    checkMobile () {
      let data = {
        params: {
          mobile: this.info['mobile']
        }
      }
      let url = this.reg ? '/user/checkMobile' : '/user/forgetPassword'
      this.api.get(url, data).then((res) => {
        if (res.code) {
          this.PromptBoxText = res.msg
          this.showPromptBox = true
        } else {
          this.getverifyCode()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getverifyCode () {
      this.second = 60
      this.countDown()
      let data = {
        params: {
          mobile: this.info['mobile']
        }
      }

      this.api.get('/verifyCode/send', data).then((res) => {
        console.log(res)
        if (res.code) {
          this.PromptBoxText = res.msg
          this.showPromptBox = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    countDown () {
      const downPerSecond = () => {
        this.second --

        if (this.timer !== null) {
          clearTimeout(this.timer)
        }

        if (this.second > 0) {
          this.timer = setTimeout(downPerSecond, 1000)
        }
      }

      downPerSecond()
    },
    getValitor (value, action) {
      if (action === 'input') {
        for (let i = 0, len = this.form.length; i < len; i++) {
          if (this.form[i].value === 'mobile' && this.form[i].value === value) {
            this.mobileValitor = Valitor.phoneValitor(this.info[value])
            if (this.mobileValitor) {
              this.form[i].valitor = true
            }
            return
          } else if (this.form[i].value === value && this.form[i].valitor) {
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
            case 'confirmPassword':
              this.form[i].valitor = this.info['password'] === this.info['confirmPassword']
              break
            case 'verifyCode':
              this.form[i].valitor = Valitor.verifyCodeValitor(this.info[value])
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
            case 'verifyCode':
              this.info[value] = Valitor.numberValitor(this.info[value])
              break
            default:
              break
          }
          break
        }
      }
    },
    fromToPrompt (msg) {
      this.showPromptBox = msg !== 'success'
      if (this.regSuccess) {
        this.$router.push({path: '/login'})
      }
    },
    fromTosBox (msg) {
      this.showTosBox = false
      if (msg === 'success') {
        this.regOrReset()
      }
    }
  },
  components: {
    HeaderItem,
    FooterItem,
    Valitor,
    Hint,
    PromptBox,
    TosBox
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/login/register.scss';
</style>

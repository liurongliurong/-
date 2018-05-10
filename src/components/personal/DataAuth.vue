<template>
  <div class="data-auth">
    <header>资料认证</header>
    <article class="prompt-box">
      <!-- <p class="title">授权税易贷平台访问您的税务信息：</p> -->
      <p class="content">授权税易贷平台将获取您的纳税人基本信息、 纳税信息、申报缴税信息、财务报表、税务违法违章信息。</p>
    </article>
    <!-- <article class="tips">
      <p>尊敬的用户，资料提交后，税务部门将发送一条验证短信到企业法人代表或财务人员手机，请确保资料真实，并注意查收短信。</p>
      <p>在认证过程中如需帮助，请联系客服或者查看常见问题  服务热线：</p>
      <p class="phone">{{phone}}</p>
    </article> -->
    <div class="content">
      <div v-for="item in form" class="item-input">
        <section>
          <span>{{item.name}}</span>
          <input type="text" v-if="item.value !== 'representMobile'" :class="{'verify-input':item.value === 'verifyCode'}" @keyup = "getKeyup(item.value)"  :placeholder="item.placeholder"
          v-model="company[item.value]" v-on:blur="getValitor(item.value)" v-on:input="getValitor(item.value, 'input')" :id="item.value" :maxLength="item.maxLength"/>
          <input type="text" v-else v-on:blur="getValitor(item.value)" v-on:input="getValitor(item.value, 'input')" @keyup="getKeyup(item.value)"
          v-model="company[item.value]" :id="item.value" :maxLength="item.maxLength"  :placeholder="item.placeholder"/>
          <button v-if="item.value === 'verifyCode'" :class="['verification',{'verify-button':item.value === 'verifyCode'}]"
          :disabled="second > 0 || !mobileValitor" @click="getverifyCode()">发送验证码{{second > 0?second+'S':''}}</button>
        </section>
        <Hint class="hint" v-if="!item.valitor" :text="item.tips"></Hint>
      </div>
      <div class="button-group">
        <div class="read">
          <i :class="['circle',{'icon-right':readProtocol}]" @click="readProtocol = !readProtocol"></i>我已阅读并同意
          <span class="blue" @click="showTosBox = true">《税易贷企业授权书》</span>
        </div>
        <button :disabled="!readProtocol" class="submit" @click="showReadProtocol()">提交认证</button>
      </div>
    </div>
    <Waiting v-if="showWaiting"></Waiting>
    <PromptBox v-if="showPromptBox" @submit="fromPromptBox" model='tips' :text='promptBoxText'></PromptBox>
    <TosBox v-if="showTosBox" @submit="fromTosBox" article='business' ></TosBox>
  </div>
</template>

<script>
import { Config } from '../../../config/default'
import { Valitor } from '../../share/validation'
import TosBox from '../common/TosBox'
import Hint from '../common/Hint'
import PromptBox from '../common/PromptBox'
import Waiting from '../common/Waiting'

export default {
  name: 'DataAuth',
  data () {
    return {
      phone: Config.phone,
      readProtocol: true,
      company: {},
      second: 0,
      showPromptBox: false,
      showTosBox: false,
      showWaiting: false,
      promptBoxText: '',
      submitText: '',
      isValitor: false,
      mobileValitor: false,
      loanSuccess: false,
      form: [
        {name: '申请主体', value: 'fullName', valitor: true, tips: '请输入主体名称', maxLength: 18, placeholder: '请输入主体名称'},
        {name: '统一社会信用代码', value: 'uscc', valitor: true, tips: '请输入18位的数字或大写英文字母的统一社会信用代码', maxLength: 18, placeholder: '请输入18位数字或字母的统一社会信用代码'},
        {name: '法人代表', value: 'representName', valitor: true, tips: '请输入法人代表', maxLength: 18, placeholder: '请输入法人代表'},
        {name: '法人代表身份证号', value: 'representNric', valitor: true, tips: '请输入正确的身份证号', maxLength: 18, placeholder: '请输入法人代表的身份证号'},
        {name: '法人代表手机号', value: 'representMobile', valitor: true, tips: '请输入正确的手机号', maxLength: 11, placeholder: '请输入地税登记的法人电话'},
        {name: '手机验证码', value: 'verifyCode', valitor: true, tips: '请输入手机验证码', maxLength: 4, placeholder: '请输入手机验证码'}
      ]
    }
  },
  created () {
    // this.getUserInfo()
  },
  updated () {
    this.getValitor('representMobile', 'input')
  },
  methods: {
    // getUserInfo () {
    //   this.api.get('user/info').then((res) => {
    //     this.company = res.data.enterprise || {}
    //     if (JSON.stringify(this.company) === '{}') {
    //       this.submitText = '提交认证'
    //     } else {
    //       this.submitText = '修改资料'
    //       this.getValitor('representMobile')
    //     }
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    showReadProtocol () {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (!this.form[i].valitor || this.company[this.form[i].value] === '' || typeof (this.company[this.form[i].value]) === 'undefined') {
          this.form[i].valitor = false
          document.getElementById(this.form[i].value).focus()
          return
        }
      }
      this.showTosBox = true
    },
    submit () {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (!this.form[i].valitor || this.company[this.form[i].value] === '' || typeof (this.company[this.form[i].value]) === 'undefined') {
          this.form[i].valitor = false
          document.getElementById(this.form[i].value).focus()
          return
        }
      }
      this.showWaiting = true
      this.api.post('/enterprise/certification', this.company).then((res) => {
        this.showWaiting = false
        if (res.msg) {
          this.promptBoxText = res.msg
          this.showPromptBox = true
        }
        if (!res.code) {
          this.loanSuccess = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getValitor (value, action) {
      if (action === 'input') {
        for (let i = 0, len = this.form.length; i < len; i++) {
          if (value === 'representMobile' && this.form[i].value === value) {
            this.mobileValitor = Valitor.phoneValitor(this.company[value])
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
            case 'representMobile':
              this.form[i].valitor = Valitor.phoneValitor(this.company[value])
              break
            case 'uscc':
              this.form[i].valitor = Valitor.usccValitor(this.company[value])
              break
            case 'representNric':
              this.form[i].valitor = Valitor.IDCardValitor(this.company[value])
              break
            case 'verifyCode':
              this.form[i].valitor = Valitor.verifyCodeValitor(this.company[value])
              break
            case 'fullName':
            case 'representName':
              this.form[i].valitor = this.company[value]
              break
            default:
              break
          }
          break
        }
      }
    },
    getverifyCode () {
      this.second = 60
      this.countDown()
      let data = {
        params: {
          mobile: this.company['representMobile']
        }
      }

      this.api.get('/verifyCode/send', data).then((res) => {
        console.log(res)
        if (res.code) {
          this.promptBoxText = res.msg
          this.showPromptBox = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getKeyup (value) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'fullName':
            case 'representName':
              this.company[value] = Valitor.ChineseAndLetterValitor(this.company[value])
              break
            case 'uscc':
              this.company[value] = Valitor.usccInputValitor(this.company[value])
              break
            case 'representNric':
              this.company[value] = Valitor.numberAndWordValitor(this.company[value])
              break
            case 'representMobile':
            case 'verifyCode':
              this.company[value] = Valitor.numberValitor(this.company[value])
              break
            default:
              break
          }
          break
        }
      }
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
    fromPromptBox (msg) {
      this.showPromptBox = msg !== 'success'
      this.company.verifyCode = ''
      if (this.loanSuccess) {
        this.$router.push({path: '/personal/loan-apply'})
      }
    },
    fromTosBox (msg) {
      this.showTosBox = false
      if (msg === 'success') {
        this.submit()
      }
    }
  },
  components: {
    Hint,
    PromptBox,
    TosBox,
    Waiting
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/personal/data-auth.scss';
</style>

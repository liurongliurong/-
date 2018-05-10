<template>
  <div class="data-auth">
    <header>贷款申请</header>
    <div class="content">
      <div v-for="item in form" class="item-input">
        <section>
          <span>{{item.name}}</span>
          <div v-if="item.value === 'fullName'" class="select-box" id="selectBox">
            <input type="text" v-model="loanInfo[item.value]" :placeholder="item.placeholder" @click="showAllCompany()"
              v-on:blur ="getValitor(item.value)" @keyup="getCompanyName()" :maxLength="item.maxLength"/>
            <div v-if="item.value === 'fullName' && showSelectCompany" class="filter-select">
              <div v-for="item in newCompanyLists" @click="selectCompany(item)">
                <span class="options">{{item.fullName}}</span>
              </div>
            </div>
          </div>
          <input type="text" v-if="item.value !== 'representMobile' && item.value !== 'fullName'" :maxLength="item.maxLength" :placeholder="item.placeholder"
          :class="{'verify-input':item.value === 'verifyCode'}" :id="item.value" @keyup="getKeyup(item.value)"
          v-model="loanInfo[item.value]" v-on:blur ="getValitor(item.value)" v-on:input ="getValitor(item.value, 'input')"/>
          <input type="text" v-if="item.value === 'representMobile'" v-on:blur ="getValitor(item.value)" :id="item.value" :maxLength="item.maxLength" :placeholder="item.placeholder"
          v-model="loanInfo[item.value]" v-on:input ="getValitor(item.value, 'input')" @keyup="getKeyup(item.value)"/>
          <button v-if="item.value === 'verifyCode'" :class="['verification',{'verify-button':item.value === 'verifyCode'}]"
          :disabled="second > 0 || !mobileValitor" @click="getverifyCode()">发送验证码{{second > 0?second+'S':''}}</button>
          <span class="unit" v-if="item.unit">{{item.unit}}</span>
        </section>
        <Hint class="hint" v-if="!item.valitor" :text="item.tips"></Hint>
      </div>
      <div class="choose-bank">
        <header class="title">选择贷款银行</header>
        <div class="banks">
          <div v-for="item in bank" v-bind:class="['bank',{'actives':currentBanK === item.id}]" @click="chooseBank(item.id)">
            <img v-if="item.ico" :src="item.ico" :alt='item.name'/>
            <span v-else="item.ico" style="font-size: large">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="button-group">
        <div class="read">
          <i :class="['circle',{'icon-right':readProtocol}]" @click="readProtocol = !readProtocol"></i>
          我已阅读并同意<span class="blue" @click="showTosBox = true">《税易贷企业授权书》</span>
        </div>
        <button :disabled="!readProtocol" class="submit" @click="showReadProtocol()">提交</button>
      </div>
    </div>
    <Waiting v-if="showWaiting"></Waiting>
    <PromptBox v-if="showPromptBox" @submit="fromPromptBox" model='tips' :text='promptBoxText'></PromptBox>
    <TosBox v-if="showTosBox" @submit="fromTosBox" article='business' ></TosBox>
  </div>
</template>

<script>
import PromptBox from '../common/PromptBox'
import TosBox from '../common/TosBox'
import { Valitor } from '../../share/validation'
import Hint from '../common/Hint'
import Waiting from '../common/Waiting'
import { Config } from '../../../config/default'

export default {
  name: 'Loan',
  data () {
    return {
      readProtocol: true,
      loanInfo: {},
      second: 0,
      showPromptBox: false,
      showTosBox: false,
      showWaiting: false,
      promptBoxText: '',
      currentBanK: '',
      mobileValitor: false,
      loanSuccess: false,
      bank: [],
      companyLists: [],
      newCompanyLists: [],
      showSelectCompany: false,
      form: [
        {name: '申请主体', value: 'fullName', valitor: true, tips: '请输入主体名称', maxLength: 18, placeholder: '请输入主体名称'},
        {name: '统一社会信用代码', value: 'uscc', valitor: true, tips: '请输入18位的数字或大写英文字母的统一社会信用代码', maxLength: 18, placeholder: '请输入18位数字或字母的统一社会信用代码'},
        {name: '法人代表', value: 'representName', valitor: true, tips: '请输入法人代表', maxLength: 18, placeholder: '请输入法人代表'},
        {name: '法人代表身份证号', value: 'representNric', valitor: true, tips: '请输入正确的身份证号', maxLength: 18, placeholder: '请输入正确的身份证号'},
        {name: '法人代表手机号', value: 'representMobile', valitor: true, tips: '请输入正确的手机号', maxLength: 11, placeholder: '请输入地税登记的法人电话'},
        {name: '手机验证码', value: 'verifyCode', valitor: true, tips: '请输入手机验证码', maxLength: 4, placeholder: '请输入手机验证码'},
        {name: '贷款额度', value: 'amount', valitor: true, tips: '请输入贷款额度', unit: '万元', maxLength: 18, placeholder: '请输入贷款额度'},
        {name: '贷款期限', value: 'term', valitor: true, tips: '请输入贷款期限', unit: '月', maxLength: 4, placeholder: '请输入贷款期限'}
      ]
    }
  },
  created () {
    this.getUserInfo()
    this.getBankList()
    this.getEnterpriseList()
  },
  updated () {
    this.getValitor('representMobile', 'input')
  },
  methods: {
    getUserInfo () {
      this.api.get('user/info').then((res) => {
        this.loanInfo = res.data.enterprise || {}
        this.mobileValitor = Valitor.phoneValitor(this.loanInfo['representMobile'])
      }).catch(error => {
        console.log(error)
      })
    },
    getEnterpriseList () {
      let data = {
        pageNumber: 1,
        pageSize: 10
      }
      this.api.post('enterprise/list', data).then((res) => {
        this.companyLists = res.data.result
        if (this.companyLists.length === 1) {
          this.selectCompany(this.companyLists[0])
        }
      }).catch(error => {
        console.log(error)
      })
    },
    showReadProtocol () {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (!this.form[i].valitor || this.loanInfo[this.form[i].value] === '' || typeof (this.loanInfo[this.form[i].value]) === 'undefined') {
          this.form[i].valitor = false
          document.getElementById(this.form[i].value).focus()
          return
        }
      }
      this.showTosBox = true
    },
    showAllCompany () {
      if (!this.showSelectCompany && !this.loanInfo['fullName']) {
        this.newCompanyLists = this.companyLists
        this.showSelectCompany = true
      }
    },
    selectCompany (item) {
      Object.assign(this.loanInfo, item)
      this.getValitor('fullName')
      this.showSelectCompany = false
    },
    getCompanyName () {
      let inputName = this.loanInfo['fullName']
      this.newCompanyLists = []
      if (inputName === '' || typeof (inputName) === 'undefined') {
        this.showSelectCompany = false
        return
      }
      this.newCompanyLists = this.companyLists.filter((item) => {
        return item.fullName.includes(inputName)
      })
      if (this.newCompanyLists.length > 0) {
        this.showSelectCompany = true
      }
    },
    submit () {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (!this.form[i].valitor || this.loanInfo[this.form[i].value] === '' || typeof (this.loanInfo[this.form[i].value]) === 'undefined') {
          this.form[i].valitor = false
          document.getElementById(this.form[i].value).focus()
          return
        }
      }
      this.loanInfo.target = this.currentBanK
      this.showWaiting = true
      this.api.post('/loan/apply', this.loanInfo).then((res) => {
        this.showWaiting = false
        if (!res.code) {
          this.showPromptBox = true
          this.promptBoxText = '提交成功'
          this.loanSuccess = true
        } else {
          this.showPromptBox = true
          this.promptBoxText = res.msg
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getBankList () {
      this.api.get('/bank/list').then((res) => {
        this.bank = res.data
        this.bank.map((item) => {
          item.ico = `${Config.backend}image/bank?bankName=${item.ico}`
        })
        this.currentBanK = this.bank[0].id
        this.loanInfo.target = this.currentBanK
      }).catch(error => {
        console.log(error)
      })
    },
    getValitor (value, action) {
      if (action === 'input') {
        for (let i = 0, len = this.form.length; i < len; i++) {
          if (value === 'representMobile' && this.form[i].value === value) {
            this.mobileValitor = Valitor.phoneValitor(this.loanInfo[value])
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
              this.form[i].valitor = Valitor.phoneValitor(this.loanInfo[value])
              break
            case 'uscc':
              this.form[i].valitor = Valitor.usccValitor(this.loanInfo[value])
              break
            case 'representNric':
              this.form[i].valitor = Valitor.IDCardValitor(this.loanInfo[value])
              break
            case 'verifyCode':
              this.form[i].valitor = Valitor.verifyCodeValitor(this.loanInfo[value])
              break
            case 'fullName':
            case 'representName':
            case 'timeUnit':
            case 'term':
            case 'amount':
              console.log(this.loanInfo[value])
              this.form[i].valitor = this.loanInfo[value]
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
            case 'fullName':
            case 'representName':
              this.loanInfo[value] = Valitor.ChineseAndLetterValitor(this.loanInfo[value])
              break
            case 'uscc':
              this.loanInfo[value] = Valitor.usccInputValitor(this.loanInfo[value])
              break
            case 'representNric':
              this.loanInfo[value] = Valitor.numberAndWordValitor(this.loanInfo[value])
              break
            case 'representMobile':
            case 'verifyCode':
            case 'amount':
            case 'term':
              this.loanInfo[value] = Valitor.numberValitor(this.loanInfo[value])
              break
            default:
              break
          }
          break
        }
      }
    },
    chooseBank (id) {
      this.loanInfo.target = id
      this.currentBanK = id
    },
    getverifyCode () {
      this.second = 60
      this.countDown()
      let data = {
        params: {
          mobile: this.loanInfo['representMobile']
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
      if (this.loanSuccess) {
        this.$router.push({path: '/personal/order'})
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
    PromptBox,
    Hint,
    TosBox,
    Waiting
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/personal/data-auth.scss';
</style>

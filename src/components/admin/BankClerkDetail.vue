<template>
  <div class="user-detail">
    <AdminHeader title="用户管理"></AdminHeader>
    <div class="container">
      <div class="table">
        <div class="thead">
          <span class="back">
            <router-link to='/admin/bank-clerk'><返回</router-link>
          </span>
          <span class="sub">用户详情</span>
        </div>
        <div v-for="item in form" class="item-input">
          <section>
            <span>{{item.name}}</span>
            <input v-if="item.value !== 'bankId'" :type="item.type" :maxLength="item.maxLength"
            v-model="userInfo[item.value]" v-on:blur ="getValitor(item.value)" :id="item.value"
            :placeholder="isEditModel?item.editTips:item.tips" @keyup="getKeyup(item.value)"/>
            <select v-if="item.value === 'bankId' && bank.length > 1" v-model="userInfo[item.value]" :id="item.value">
              <option :value="item.id" v-for="item in bank">{{item.name}}</option>
            </select>
            <span class="show-bank-name" v-if="item.value === 'bankId' && bank.length === 1">
              {{bank[0].name}}
            </span>
          </section>
          <Hint class="hint" v-if="!item.valitor" :text="item.tips"></Hint>
        </div>
        <div class="button-group">
          <button @click="submit()">确认提交</button>
        </div>
      </div>
    </div>
    <PromptBox v-if="showPromptBox" @submit="fromPromptBox" model='tips' :text='promptBoxText'></PromptBox>
  </div>
</template>

<script>
import AdminHeader from './Header'
import { Valitor } from '../../share/validation'
import Hint from '../common/Hint'
import PromptBox from '../common/PromptBox'

export default {
  name: 'BankClerkDetail',
  data () {
    return {
      userId: '',
      userInfo: {},
      bank: {},
      bankId: '',
      isEditModel: false,
      showPromptBox: false,
      submitSuccess: false,
      promptBoxText: '',
      form: [
        {name: '所属银行', value: 'bankId', valitor: true, tips: '', editTips: '', type: 'text'},
        {name: '联系人', value: 'name', valitor: true, tips: '请输入用户姓名', editTips: '请输入用户姓名', type: 'text', maxLength: 18},
        {name: '联系方式', value: 'mobile', valitor: true, tips: '请输入正确的手机号', editTips: '请输入正确的手机号', type: 'text', maxLength: 12},
        {name: '联系地址', value: 'receivingBank', valitor: true, tips: '请输入所属支行', editTips: '请输入所属支行', type: 'text', maxLength: 20}
      ]
    }
  },
  created: function () {
    this.orderId = ''
    this.isEditModel = this.$route.path.includes('edit')
    if (this.isEditModel) {
      this.userId = this.$route.query.id
      this.getOrderDetail()
    }
    this.getUserInfo()
  },
  methods: {
    getOrderDetail () {
      let data = {
        params: {
          id: this.userId
        }
      }

      this.api.get('/manage/receiver/detail', data).then((res) => {
        this.userInfo = res
      }).catch(error => {
        console.log(error)
      })
    },
    getUserInfo () {
      this.api.get('/manager/info').then((res) => {
        this.bankId = res.data.bankId
        this.getBankList()
      }).catch(error => {
        console.log(error)
      })
    },
    getBankList () {
      this.api.get('/manage/bank/list').then((res) => {
        this.bank = res.data
        if (this.bankId) {
          this.bank = this.bank.filter((item) => {
            return item.id === this.bankId
          })
          this.userInfo['bankId'] = this.bankId
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getValitor (value) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'mobile':
              this.form[i].valitor = this.userInfo[value].length >= 11
              break
            case 'password':
              this.form[i].valitor = Valitor.passwordValitor(this.userInfo[value])
              break
            case 'repeatPassword':
              this.form[i].valitor = this.userInfo[value] === this.userInfo['password']
              break
            case 'account':
            case 'name':
            case 'target':
              this.form[i].valitor = this.userInfo[value] && this.userInfo[value] !== ''
              break
            default:
              break
          }
          break
        }
      }
    },
    submit () {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (!this.form[i].valitor || this.userInfo[this.form[i].value] === '' || typeof (this.userInfo[this.form[i].value]) === 'undefined') {
          this.form[i].valitor = false
          document.getElementById(this.form[i].value).focus()
          return
        }
      }
      let data = {
        params: this.userInfo
      }

      let url = this.isEditModel ? '/manage/receiver/modify' : '/manage/receiver/add'
      this.api.get(url, data).then((res) => {
        this.promptBoxText = res['msg']
        this.showPromptBox = true
        if (!res.code) {
          this.submitSuccess = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getKeyup (value) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'name':
              this.userInfo[value] = Valitor.wordValitor(this.userInfo[value])
              break
            case 'mobile':
              this.userInfo[value] = Valitor.phoneInputValitor(this.userInfo[value])
              break
            case 'receivingBank':
              this.userInfo[value] = Valitor.ChineseAndLetterValitor(this.userInfo[value])
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
      if (this.submitSuccess) {
        this.$router.push({path: '/admin/bank-clerk'})
      }
    }
  },
  components: {
    AdminHeader,
    Hint,
    PromptBox
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/admin/user-detail.scss';
@import '../../stylesheets/admin/admin-common.scss';
</style>

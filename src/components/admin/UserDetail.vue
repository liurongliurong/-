<template>
  <div class="user-detail">
    <AdminHeader title="用户管理"></AdminHeader>
    <div class="container">
      <div class="table">
        <div class="thead">
          <span class="back">
            <router-link to='/admin/user-manage'><返回</router-link>
          </span>
          <span class="sub">用户详情</span>
        </div>
        <div v-for="item in form" class="item-input">
          <section>
            <span>{{item.name}}</span>
            <input type="text" v-if="item.value === 'mobile'" v-on:blur ="getValitor(item.value)" :id="item.value" :maxLength="item.maxLength" :placeholder="isEditModel?item.editTips:item.tips"
            v-model="userInfo[item.value]" v-on:input ="getValitor(item.value, 'input')" @keyup="getKeyup(item.value)"/>
            <input v-if="(item.value === 'account' && !isEditModel ) || (item.value !== 'target' && item.value !== 'mobile' && item.value !== 'account')" :type="item.type" :class="{'verify-input':item.value === 'verifyCode'}"
            v-model="userInfo[item.value]" v-on:blur ="getValitor(item.value)" :maxLength="item.maxLength"
            :placeholder="isEditModel?item.editTips:item.tips" :id="item.value" @keyup="getKeyup(item.value)"/>
            <select v-if="item.value === 'target'" v-model="userInfo[item.value]" :id="item.value">
              <option :value="item.id" v-for="item in bank">{{item.name}}</option>
            </select>
            <button v-if="item.value === 'verifyCode'" :class="['verification',{'verify-button':item.value === 'verifyCode'}]"
            :disabled="second > 0 || !mobileValitor" @click="getverifyCode()">发送验证码{{second > 0?second+'S':''}}</button>
            <span class="show-user-name" v-if="item.value === 'account' && isEditModel">
              {{userInfo[item.value]}}
            </span>
            <!-- <input v-if="item.value === 'status'" type="radio" name="itemmust" value=1 v-model="item.isNeed"/>
            <label v-if="item.value === 'status'" class="result-label">启用</label>
            <input v-if="item.value === 'status'" type="radio" name="itemmust" value=0 v-model="item.isNeed"/>
            <label v-if="item.value === 'status'">禁用</label> -->
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
import { mapState } from 'vuex'

export default {
  name: 'UserDetail',
  data () {
    return {
      userId: '',
      userInfo: {},
      bank: {},
      isEditModel: false,
      showPromptBox: false,
      mobileValitor: false,
      second: 0,
      promptBoxText: '',
      isSuccess: false,
      form: [
        {name: '用户名', value: 'account', valitor: true, tips: '请输入用户名', editTips: '请输入用户名', type: 'text', maxLength: 18},
        {name: '用户姓名', value: 'name', valitor: true, tips: '请输入用户姓名', editTips: '请输入用户姓名', type: 'text', maxLength: 18},
        {name: '手机号', value: 'mobile', valitor: true, tips: '请输入正确的手机号', editTips: '请输入正确的手机号', type: 'text', maxLength: 11},
        {name: '密码', value: 'password', valitor: true, tips: '请输入6到18位数字加字母的密码', editTips: '如果你不想修改密码，请将此项留空', type: 'password', maxLength: 18},
        {name: '确认密码', value: 'repeatPassword', valitor: true, tips: '两次的密码不一致', editTips: '如果你不想修改密码，请将此项留空', type: 'password', maxLength: 18},
        {name: '数据权限范围', value: 'target', valitor: true, tips: '', editTips: '', type: 'text'}
      ],
      verifyCode: {name: '手机验证码', value: 'verifyCode', valitor: true, tips: '请输入手机验证码', editTips: '请输入手机验证码', type: 'text', maxLength: 4}
    }
  },
  computed: {
    ...mapState({
      userAccount: function (state) {
        if (!state.adminUserInfo.account) {
          this.$store.commit('ADMIN_GET_INFO')
        }
        return state.adminUserInfo.account
      }
    })
  },
  created: function () {
    this.userDetailInit()
  },
  updated () {
    this.getValitor('mobile', 'input')
  },
  watch: {
    '$route': function () {
      this.userDetailInit()
    }
  },
  methods: {
    userDetailInit () {
      this.orderId = ''
      this.isEditModel = this.$route.path.includes('edit')
      if (this.isEditModel) {
        this.userId = this.$route.query.id
        this.getOrderDetail()
      } else {
        this.addTarget()
      }
      this.getBankList()
    },
    getOrderDetail () {
      let data = {
        params: {
          id: this.userId
        }
      }

      this.api.get('/manager/detail', data).then((res) => {
        this.userInfo = res.data
        this.addTarget()
      }).catch(error => {
        console.log(error)
      })
    },
    getBankList () {
      this.api.get('/manage/bank/list').then((res) => {
        this.bank = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    getValitor (value, action) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'mobile':
              if (action === 'input') {
                this.mobileValitor = Valitor.phoneValitor(this.userInfo[value])
                if (this.mobileValitor) {
                  this.form[i].valitor = true
                }
              } else {
                this.form[i].valitor = Valitor.phoneValitor(this.userInfo[value])
              }
              break
            case 'password':
              this.form[i].valitor = Valitor.passwordValitor(this.userInfo[value])
              break
            case 'repeatPassword':
              this.form[i].valitor = this.userInfo[value] === this.userInfo['password']
              break
            case 'verifyCode':
              this.form[i].valitor = Valitor.verifyCodeValitor(this.userInfo[value])
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
    addTarget () {
      if (this.userInfo['account'] === this.userAccount) {
        this.form = this.form.filter((item) => {
          return item.value !== 'target'
        })
        this.form.splice(3, 0, this.verifyCode)
      }
    },
    submit () {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (!this.form[i].valitor || this.userInfo[this.form[i].value] === '' || typeof (this.userInfo[this.form[i].value]) === 'undefined') {
          if (this.form[i].value === 'password' || this.form[i].value === 'repeatPassword' || this.form[i].value === 'target') {
            if (this.form[i].valitor) {
              break
            }
          }
          this.form[i].valitor = false
          document.getElementById(this.form[i].value).focus()
          return
        }
      }

      (this.userInfo['account'] === this.userAccount) ? Object.assign(this.userInfo, {self: true}) : Object.assign(this.userInfo, {self: false})

      let data = {
        params: this.userInfo
      }

      let url = this.isEditModel ? '/manage/reset/info' : '/manager/add'
      this.api.get(url, data).then((res) => {
        this.promptBoxText = res['msg']
        this.showPromptBox = true
        if (!res.code) {
          this.isSuccess = true
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
          mobile: this.userInfo['mobile']
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
    getKeyup (value) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'account':
            case 'name':
              this.userInfo[value] = Valitor.wordValitor(this.userInfo[value])
              break
            case 'password':
            case 'repeatPassword':
              this.userInfo[value] = Valitor.wordValitor(this.userInfo[value])
              break
            case 'mobile':
            case 'verifyCode':
              this.userInfo[value] = Valitor.numberValitor(this.userInfo[value])
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
      if (this.isSuccess) {
        window.history.back()
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

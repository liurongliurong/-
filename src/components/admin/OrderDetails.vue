<template>
  <div class="order-details">
    <AdminHeader title="订单管理"></AdminHeader>
    <div class="container">
      <div class="table">
        <div class="thead">
          <span class="back">
            <router-link to='/admin/order-manage'><返回</router-link>
          </span>
          <span class="sub">订单详情</span>
        </div>
        <div class="order-status">
          订单状态:
          <span class="status" :style="{'color': getStatusColor()}">{{getStatus(status)}}</span>
          <span v-if="loanInfo.rejectReason">(理由：{{loanInfo.rejectReason}})</span>
          <span v-if="!loanInfo.files.baoquan" style="color:#f7a033">订单上链保全中...</span>
          <span v-if="status === 20" class="show-pdf">
            <a v-if="loanInfo.files.baoquan" :href="loanInfo.files.baoquan" target="_blank"><i class="iconfont icon-directed"></i>查看订单保全书</a>
            <span>(此审批结果仅供参考，具体审核结果以银行正式合同为准！)</span>
          </span>
        </div>
        <div class="order-info">
          <header>订单概要</header>
          <section>
            <div>
              <span class="title">公司</span>
              <span>{{loanInfo.enterpriseName}}</span>
            </div>
            <div>
              <span class="title">统一社会信用代码</span>
              <span>{{loanInfo.enterpriseUscc}}</span>
            </div>
          </section>
          <section>
            <div>
              <span class="title">订单号</span>
              <span>{{loanInfo.sequence}}</span>
            </div>
            <div>
              <span class="title">申请人手机号</span>
              <span>{{loanInfo.userAccount}}</span>
            </div>
          </section>
          <section>
            <div>
              <span class="title">贷款银行</span>
              <span>{{loanInfo.target}}</span>
            </div>
            <div>
              <span class="title">申请时间</span>
              <span>{{loanInfo.applyTime}}</span>
            </div>
          </section>
          <section>
            <div>
              <span class="title">纳税证明</span>
              <span v-if="status === 0" @click="orderAccept()" class="receive">点击接收</span>
              <span v-else class="show-pdf">
                <a :href="downloadFile" download><i class="download"></i>查看纳税证明pdf</a>
              </span>
            </div>
            <div v-if="this.authFile">
              <span class="title">数据授权</span>
              <span v-if="status === 0">请先接收</span>
              <span v-else class="show-pdf">
                <a :href="authFile" target="_blank"><i class="iconfont icon-directed"></i>查看授权保全书</a>
              </span>
            </div>
          </section>
        </div>
        <div class="order-info">
          <header>贷款详情</header>
          <section>
            <div>
              <span class="title">贷款总额</span>
              <span>{{loanInfo.amount}}万元</span>
            </div>
            <div>
              <span class="title">贷款期限</span>
              <span>{{loanInfo.term}}月</span>
            </div>
          </section>
          <section v-if="status === 20">
            <div v-if="loanInfo.name">
              <span class="title">银行联系人</span>
              <span>{{loanInfo.name}}</span>
            </div>
            <div v-if="loanInfo.mobile">
              <span class="title">联系方式</span>
              <span>{{loanInfo.mobile}}</span>
            </div>
          </section>
          <section v-if="status === 20">
            <div v-if="loanInfo.receivingBank">
              <span class="title">联系地址</span>
              <span>{{loanInfo.receivingBank}}</span>
            </div>
          </section>
        </div>
        <div class="review-loan" v-if="status === 0 || status === 10">
          <div class="button-group">
            <button :class="{'deny-button':!isAgreeLoan}" @click="isAgreeLoan = true">同意贷款，一键保全</button>
            <button :class="{'deny-button':isAgreeLoan}" @click="isAgreeLoan = false">拒绝贷款</button>
          </div>
          <div class="agree-loan" v-if="isAgreeLoan">
            <div v-for="item in form" class="item-input">
              <section>
                <span class="input-name">{{item.name}}</span>
                <div v-if="item.value === 'name'" class="select-box" id="selectBox">
                  <input type="text" v-model="agreeLoanInfo[item.value]"
                    v-on:blur ="getValitor(item.value)" @keyup="getBankClerk()" :maxLength="item.maxLength"/>
                  <div v-if="item.value === 'name' && showSelectClerk" class="filter-select">
                    <div v-for="item in newBankClerk" @click="selectClerk(item)">
                      <span>{{item.name}}({{item.mobile}})</span>
                    </div>
                  </div>
                </div>
                <input type="text" v-if="item.value !== 'name'"  @keyup="getKeyup(item.value)" v-model="agreeLoanInfo[item.value]"
                  v-on:blur ="getValitor(item.value)" :maxLength="item.maxLength"/>
              </section>
              <Hint class="hint" v-if="!item.valitor" :text="item.tips"></Hint>
            </div>
          </div>
          <div class="item-input" v-if="!isAgreeLoan">
            <section>
              <span class="input-name">选择理由</span>
              <select v-model="reviewLoan['reason']">
                <option v-for="item in reasonList">{{item.detail}}</option>
              </select>
            </section>
            <section class="input-reason" v-if="reviewLoan['reason'] === '其它'">
              <span class="input-name">其它理由</span>
              <textarea class="reason" v-model="reviewLoan['writReason']" id="writReason"
              placeholder="请输入拒绝理由"
              onkeyup="value=value.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '')"></textarea>
            </section>
            <Hint class="hint" v-if="!reviewLoan.valitor" text="请输入拒绝理由"></Hint>
          </div>
          <button class="submit-button" @click="agreeLoan()">提交</button>
        </div>
      </div>
    </div>
    <PromptBox v-if="showPromptBox" @submit="fromPromptBox" model='tips' :text='promptBoxText'></PromptBox>
  </div>
</template>

<script>
import AdminHeader from './Header'
import { Status } from '../../share/orderStatus'
import PromptBox from '../common/PromptBox'
import { Valitor } from '../../share/validation'
import { Config } from '../../../config/default'
import Hint from '../common/Hint'
import Calendar from '../common/Calendar'

export default {
  name: 'OrderDetails',
  data () {
    return {
      orderId: '',
      isAgreeLoan: true,
      successOrder: false,
      showSelectClerk: false,
      loanInfo: {},
      status: 1,
      getStatus: Status.getOrderStatus,
      reasonList: {},
      reviewLoan: {
        valitor: true
      },
      agreeLoanInfo: {},
      showPromptBox: false,
      promptBoxText: '',
      reason: {
        title: '',
        detail: ''
      },
      selectValue: '',
      firstLimit: {
        minYear: 2000,
        minMonth: 1,
        minDay: 1
      },
      downloadFile: '',
      authFile: '',
      form: [
        {name: '联系人', value: 'name', valitor: true, tips: '请输入联系人', maxLength: 6},
        {name: '联系方式', value: 'mobile', valitor: true, tips: '请输入联系方式', maxLength: 12},
        {name: '联系地址', value: 'receivingBank', valitor: true, tips: '请输入联系地址', maxLength: 30}
      ],
      bankClerkList: [],
      newBankClerk: []
    }
  },
  created: function () {
    this.orderId = this.$route.query.orderId
    this.getOrderDetail()
    this.getReasonList()
    this.getBankClerkList()
    // 点击其他地方 下拉框消失
    if (document.getElementById('selectBox')) {
      document.getElementById('selectBox').addEventListener('click', (e) => {
        if (!document.getElementById('selectBox').contains(e.target)) {
          this.showSelectClerk = false
        }
      })
    }
  },
  methods: {
    getOrderDetail () {
      let data = {
        params: {
          orderId: this.orderId
        }
      }

      this.api.get('/manage/order/detail', data).then((res) => {
        this.loanInfo = res.data
        this.status = res.data.status
        this.downloadFile = `${Config.backend}manage/order/file?fileKey=${res.data.files.tax}`
        if (res.data.files.auth) {
          this.authFile = res.data.files.auth
        }
      }).catch(error => {
        console.log(error)
      })
    },
    agreeLoan () {
      let data = {}
      let url = ''
      if (this.status === 0) {
        this.showPromptBox = true
        this.promptBoxText = '请先接收该订单'
        return
      }

      if (this.isAgreeLoan) {
        for (let i = 0, len = this.form.length; i < len; i++) {
          if (!this.form[i].valitor || this.agreeLoanInfo[this.form[i].value] === '' || typeof (this.agreeLoanInfo[this.form[i].value]) === 'undefined') {
            this.form[i].valitor = false
            return
          }
        }
        url = '/manage/order/agree'
        data = {
          orderId: this.orderId,
          name: this.agreeLoanInfo.name,
          mobile: this.agreeLoanInfo.mobile,
          receivingBank: this.agreeLoanInfo.receivingBank
        }
      } else {
        let reason = this.reviewLoan['reason'] === '其它' ? this.reviewLoan['writReason'] : this.reviewLoan['reason']

        if (this.reviewLoan['reason'] === '其它') {
          if (this.reviewLoan['writReason'] === '' || typeof (this.reviewLoan['writReason']) === 'undefined') {
            this.reviewLoan.valitor = false
            document.getElementById('writReason').focus()
            return
          }
        }

        url = '/manage/order/deny'
        data = {
          orderId: this.loanInfo.orderId,
          reason: reason
        }
      }

      this.api.post(url, data).then((res) => {
        this.showPromptBox = true
        this.promptBoxText = res.msg
        if (!res.code) {
          this.successOrder = true
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getBankClerkList () {
      let data = {
        pageNumber: this.currentPage,
        pageSize: 10
      }

      this.api.post('/manage/receiver/list', data).then((res) => {
        this.bankClerkList = res.data['result'] || []
      }).catch(error => {
        console.log(error)
      })
    },
    getBankClerk () {
      let inputName = this.agreeLoanInfo['name']
      this.newBankClerk = []
      if (inputName === '' || typeof (inputName) === 'undefined') {
        this.showSelectClerk = false
        return
      }
      this.newBankClerk = this.bankClerkList.filter((item) => {
        return item.name.includes(inputName)
      })
      if (this.newBankClerk.length > 0) {
        this.showSelectClerk = true
      }
    },
    getKeyup (value) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'mobile':
              this.agreeLoanInfo[value] = Valitor.phoneInputValitor(this.agreeLoanInfo[value])
              break
            case 'name':
            case 'receivingBank':
              this.agreeLoanInfo[value] = Valitor.ChineseAndLetterValitor(this.agreeLoanInfo[value])
              break
            default:
              break
          }
          break
        }
      }
    },
    selectClerk (item) {
      this.agreeLoanInfo['name'] = item.name
      this.agreeLoanInfo['mobile'] = item.mobile
      this.agreeLoanInfo['receivingBank'] = item.receivingBank
      this.showSelectClerk = false
    },
    getReasonList () {
      this.api.get('/manage/reason/option').then((res) => {
        this.reasonList = res.data
        this.reasonList.push({
          title: '其它',
          detail: '其它'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    getValitor (value, action) {
      for (let i = 0, len = this.form.length; i < len; i++) {
        if (this.form[i].value === value) {
          switch (value) {
            case 'name':
            case 'receivingBank':
              this.form[i].valitor = this.agreeLoanInfo[value]
              break
            case 'mobile':
              this.form[i].valitor = this.agreeLoanInfo[value].length >= 11
              break
            default:
              break
          }
          break
        }
      }
    },
    orderAccept () {
      let data = {
        orderId: this.orderId
      }

      this.api.post('/manage/order/accept', data).then((res) => {
        if (!res.code) {
          this.status = 10
          this.getOrderDetail()
        } else {
          this.showPromptBox = true
          this.promptBoxText = res.msg
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getStatusColor () {
      switch (this.status) {
        case 0: return '#f7a033'
        case 20: return '#0d9b00'
        case 21: return '#f04134'
        default: return '#333'
      }
    },
    fromPromptBox (msg) {
      this.showPromptBox = msg !== 'success'
      if (this.successOrder) {
        this.$router.push({path: '/admin/order-manage'})
      }
    },
    getValue (selectValue) {
      this.selectValue = selectValue
      this.reviewLoan.timeLimit = selectValue
    }
  },
  filters: {
    date: function (value) {
      if (!value) return ''
      return value.substring(0, 10)
    }
  },
  components: {
    AdminHeader,
    PromptBox,
    Hint,
    Valitor,
    Calendar
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/admin/order-detail.scss';
@import '../../stylesheets/admin/admin-common.scss';
</style>

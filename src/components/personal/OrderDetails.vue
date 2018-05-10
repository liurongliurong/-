<template>
  <div class="order-details">
    <header>
      <span>订单详情</span>
      <button @click="back()">返回</button>
    </header>
    <main class="container">
      <div class="order-status">
        订单状态:
        <span class="status" :style="{'color': getStatusColor()}">{{getStatus(this.status)}}</span>
        <span v-if="this.loanInfo.rejectReason">(理由：{{this.loanInfo.rejectReason}})</span>
        <button v-if="status === 0" class="cancel" @click="showPromptBox = true">撤销订单</button>
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
            <span class="show-pdf">
              <a :href="downloadFile" download><i class="download"></i>查看纳税证明pdf</a>
            </span>
          </div>
          <div v-if="authFile">
            <span class="title">数据授权</span>
            <span class="show-pdf">
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
      <PromptBox v-if="showPromptBox" @submit="fromPromptBox" model='select' text='撤销后此订单将作废,是否确认撤销订单?'></PromptBox>
      <!--<div class="agree-loan" v-if="status === 20 && loanInfo.files.baoquan">
        <img src='../../assets/common/seal.png' />
        <button>
          <a :href="loanInfo.files.baoquan" target="_blank">查看保全书</a>
        </button>
      </div>
      <p class="confirm" v-if="status === 'finish'">如已收到款项，请点击确认</p>
      <section class="button-group">
        <button class="download-button" v-if="status === 'finish'">下载保全书</button>
        <button class="submit">确认收款</button>
      </section> -->
    </main>
  </div>
</template>

<script>
import { Status } from '../../share/orderStatus'
import PromptBox from '../common/PromptBox'
import { Config } from '../../../config/default'

export default {
  name: 'OrderDetails',
  data () {
    return {
      orderId: '',
      status: '',
      reasonOption: [],
      loanInfo: {},
      showPromptBox: false,
      getStatus: Status.getOrderStatus,
      downloadFile: '',
      authFile: '',
      statusList: [
        {status: 20, buttonName: '确认收款'},
        {status: 30, buttonName: '立即还款'},
        {status: 21, buttonName: '重新申请'}
      ]
    }
  },
  created () {
    this.getOrderDetail()
  },
  methods: {
    getOrderDetail () {
      this.orderId = this.$route.query.orderId || null
      let data = {
        params: {
          orderId: this.orderId
        }
      }
      this.api.get('/order/detail', data).then((res) => {
        this.loanInfo = res.data || {}
        this.status = res.data.status
        this.downloadFile = `${Config.backend}order/file?fileKey=${res.data.files.tax}`
        if (res.data.files.auth) {
          this.authFile = res.data.files.auth
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getOrderRecall () {
      let data = {
        params: {
          orderId: this.orderId
        }
      }

      this.api.get('/order/recall', data).then((res) => {
        if (!res.code) {
          this.$router.push({path: '/personal/order'})
        }
      }).catch(error => {
        console.log(error)
      })
    },
    back () {
      window.history.back()
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
      this.showPromptBox = false
      if (msg === 'success') {
        this.getOrderRecall()
      }
    }
  },
  filters: {
    date: function (value) {
      if (!value) return ''
      return value.substring(0, 10)
    }
  },
  components: {
    PromptBox
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/personal/order-details.scss';
</style>

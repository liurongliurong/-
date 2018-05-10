<template>
  <div class="admin-user">
    <AdminHeader title="银行人员"></AdminHeader>
    <div class="search">
      <button class="add-user">
        <router-link to="/admin/bank-clerk/detail/new">＋ 添加人员</router-link>
      </button>
      <div class="search-input">
        <input type="text" placeholder="请输入查询条件" @keyup.enter="getManageLists()" v-model="keyWord"/>
        <i @click="getManageLists()"></i>
      </div>
    </div>
    <div class="container">
      <div class="table">
        <div class="thead">
          <span v-for="item in tableTitle" v-bind:style="{ width: item.width + '%'}">{{item.name}}</span>
        </div>
        <div class="tbody">
          <section v-for="item in manageLists" class="td">
            <span v-bind:style="{ width: '20%'}">{{item.name || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.mobile || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.bankName || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.receivingBank || "──"}}</span>
            <div class="button-group" v-bind:style="{ width: '20%'}">
              <span class="detail-button" @click="editManage(item.id)">编辑</span>
              <span class="detail-button red" @click="currentId = item.id; showPromptSelectBox = true">删除</span>
            </div>
          </section>
        </div>
        <div class="tfoot">
          <span class="total-page">共{{pageConfig.totalPageCount}}页</span>
          <Pagination :config='pageConfig' @page="goToPage"></Pagination>
        </div>
      </div>
    </div>
    <PromptBox v-if="showPromptBox" @submit="fromPromptBox" model='tips' :text='promptBoxText'></PromptBox>
    <PromptBox v-if="showPromptSelectBox" @submit="fromPromptSelectBox" model='select' text='是否确认删除该用户?'></PromptBox>
  </div>
</template>

<script>
import AdminHeader from './Header'
import Pagination from '../common/Pagination'
import PromptBox from '../common/PromptBox'

export default {
  name: 'BankClerk',
  data () {
    return {
      keyWord: '',
      totalPageCount: 0,
      manageLists: [],
      currentPage: 1,
      currentId: '',
      showPromptBox: false,
      showPromptSelectBox: false,
      successSubmit: false,
      pageConfig: {
        pageNo: 1,
        totalPageCount: 1,
        totalRecordCount: 1,
        pageSize: 10
      },
      tableTitle: [
        {name: '银行联系人', width: '20'},
        {name: '联系方式', width: '20'},
        {name: '所属银行', width: '20'},
        {name: '联系地址', width: '20'},
        {name: '操作', width: '20'}
      ]
    }
  },
  created: function () {
    this.getManageLists()
  },
  methods: {
    getManageLists () {
      let data = {
        pageNumber: this.currentPage,
        pageSize: 10
      }

      if (this.keyWord !== '') {
        data.keyword = this.keyWord
      }
      this.api.post('/manage/receiver/list', data).then((res) => {
        this.manageLists = res.data['result'] || []
        for (let key in this.pageConfig) {
          this.pageConfig[key] = res.data[key]
        }
      }).catch(error => {
        console.log(error)
      })
    },
    deleteUser () {
      let data = {
        params: {
          id: this.currentId
        }
      }

      this.api.get('/manage/receiver/delete', data).then((res) => {
        this.showPromptBox = true
        this.promptBoxText = res.msg
        if (!res.code) {
          this.manageLists = this.manageLists.filter((item) => {
            return item.id !== this.currentId
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // stopUser (userId, status) {
    //   let statusValue = status === '启用' ? 1 : 0
    //   let data = {
    //     id: userId,
    //     status: statusValue
    //   }

    //   this.api.post('manager/status', data).then((res) => {
    //     if (!res['code']) {
    //       for (let i = 0, len = this.manageLists.length; i < len; i++) {
    //         if (this.manageLists[i].id === userId) {
    //           this.manageLists[i].status = status === '启用' ? '禁用' : '启用'
    //         }
    //       }
    //     }
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // },
    editManage (id) {
      this.$router.push({path: '/admin/bank-clerk/detail/edit', query: {id: id}})
    },
    goToPage (page) {
      if (page !== this.currentPage) {
        this.currentPage = page
        this.getManageLists()
      }
    },
    fromPromptBox (msg) {
      this.showPromptBox = msg !== 'success'
    },
    fromPromptSelectBox (msg) {
      this.showPromptSelectBox = false
      if (msg === 'success') {
        this.deleteUser()
      }
    }
  },
  components: {
    AdminHeader,
    Pagination,
    PromptBox
  }
}
</script>

<style lang='scss' scoped>
@import '../../stylesheets/admin/user.scss';
@import '../../stylesheets/admin/admin-common.scss';

.add-user {
  width: 126px;
  height: 42px;
  background: #3dbd7d;
  border-radius: 8px;

  a {
    color: #fff;
  }
}
</style>

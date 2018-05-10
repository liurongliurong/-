<template>
  <div class="admin-user">
    <AdminHeader title="用户管理"></AdminHeader>
    <div class="search">
      <button class="add-user">
        <router-link to="/admin/user-manage/detail/new">＋ 添加用户</router-link>
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
            <span v-bind:style="{ width: '15%'}">{{item.account || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.name || "──"}}</span>
            <span v-bind:style="{ width: '20%'}">{{item.mobile || "──"}}</span>
            <span v-bind:style="{ width: '15%'}">{{item.target || "──"}}</span>
            <span v-bind:style="{ width: '15%'}">{{item.status || "──"}}</span>
            <div class="button-group" v-bind:style="{ width: '15%'}">
              <span class="detail-button" @click="editManage(item.id)">编辑</span>
              <span v-if="item.account !== 'admin'" class="detail-button red" @click="stopUser(item.id, item.status)">{{item.status === '启用'?'禁用':'启用'}}</span>
            </div>
          </section>
        </div>
        <div class="tfoot">
          <span class="total-page">共{{pageConfig.totalPageCount}}页</span>
          <Pagination :config='pageConfig' @page="goToPage"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminHeader from './Header'
import Pagination from '../common/Pagination'
import { mapState } from 'vuex'

export default {
  name: 'UserManage',
  data () {
    return {
      keyWord: '',
      totalPageCount: 0,
      manageLists: [],
      currentPage: 1,
      pageConfig: {
        pageNo: 1,
        totalPageCount: 1,
        totalRecordCount: 1,
        pageSize: 10
      },
      tableTitle: [
        {name: '用户ID', width: '15'},
        {name: '用户姓名', width: '20'},
        {name: '手机号', width: '20'},
        {name: '数据权限范围', width: '15'},
        {name: '启用状态', width: '15'},
        {name: '操作', width: '15'}
      ]
    }
  },
  created: function () {
    this.getManageLists()
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
  methods: {
    getManageLists () {
      let data = {
        pageNumber: this.currentPage,
        pageSize: 10
      }

      if (this.keyWord !== '') {
        data.keyword = this.keyWord
      }
      this.api.post('manager/list', data).then((res) => {
        this.manageLists = res.data['result'] || []
        for (let key in this.pageConfig) {
          this.pageConfig[key] = res.data[key]
        }
      }).catch(error => {
        console.log(error)
      })
    },
    stopUser (userId, status) {
      let statusValue = status === '启用' ? 1 : 0
      let data = {
        id: userId,
        status: statusValue
      }

      this.api.post('manager/status', data).then((res) => {
        if (!res['code']) {
          for (let i = 0, len = this.manageLists.length; i < len; i++) {
            if (this.manageLists[i].id === userId) {
              this.manageLists[i].status = status === '启用' ? '禁用' : '启用'
            }
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    editManage (id) {
      this.$router.push({path: '/admin/user-manage/detail/edit', query: {id: id}})
    },
    goToPage (page) {
      if (page !== this.currentPage) {
        this.currentPage = page
        this.getManageLists()
      }
    }
  },
  components: {
    AdminHeader,
    Pagination
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

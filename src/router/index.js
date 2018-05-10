import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Login from '@/components/login/Login'
import AdminLogin from '@/components/login/AdminLogin'
import Register from '@/components/login/Register'
import Tos from '@/components/login/Tos'

import DataAuth from '@/components/personal/DataAuth'
import Loan from '@/components/personal/Loan'
import Personal from '@/components/personal/Personal'
import Order from '@/components/personal/Order'
import OrderDetails from '@/components/personal/OrderDetails'
import PersonalCenter from '@/components/personal/PersonalCenter'
import AuthList from '@/components/personal/AuthList'

import Admin from '@/components/admin/Admin'
import AdminRegisterUser from '@/components/admin/RegisterUser'
import AdminOrderManage from '@/components/admin/OrderManage'
import AdminOrderDetails from '@/components/admin/OrderDetails'
import AdminUserManage from '@/components/admin/UserManage'
import AdminUserDetail from '@/components/admin/UserDetail'
import AdminStatistics from '@/components/admin/Statistics'
import AdminBankClerk from '@/components/admin/BankClerk'
import AdminBankClerkDetail from '@/components/admin/BankClerkDetail'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/personal' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
    { path: '/home', name: 'Home', component: Home },
    { path: '/register', name: 'Register', component: Register },
    { path: '/change-password', name: 'Register', component: Register },
    { path: '/tos', name: 'Tos', component: Tos },
    {
      path: '/personal',
      component: Personal,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('logged') === 'true') {
          next()
        } else {
          next({name: 'Login'})
        }
      },
      children: [
        { path: '', name: 'PersonalCenter', component: PersonalCenter },
        { path: 'auth', name: 'DataAuth', component: DataAuth },
        { path: 'auth/list', name: 'AuthList', component: AuthList },
        { path: 'loan-apply', name: 'Loan', component: Loan },
        { path: 'order', name: 'Order', component: Order },
        { path: 'order-details', name: 'OrderDetails', component: OrderDetails }
      ]
    },
    {
      path: '/admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('logged') === 'true') {
          next()
        } else {
          next({name: 'AdminLogin'})
        }
      },
      children: [
        { path: '/', redirect: '/admin/statistics' },
        { path: 'statistics', name: 'Statistics', component: AdminStatistics },
        { path: 'register-user', name: 'AdminRegisterUser', component: AdminRegisterUser },
        { path: 'order-manage', name: 'AdminOrderManage', component: AdminOrderManage },
        { path: 'order-manage/detail', name: 'AdminOrderDetails', component: AdminOrderDetails },
        { path: 'user-manage', name: 'AdminUserManage', component: AdminUserManage },
        { path: 'user-manage/detail/new', name: 'AdminUserDetail', component: AdminUserDetail },
        { path: 'user-manage/detail/edit', name: 'AdminUserDetail', component: AdminUserDetail },
        { path: 'bank-clerk', name: 'AdminBankClerk', component: AdminBankClerk },
        { path: 'bank-clerk/detail/new', name: 'AdminBankClerkDetail', component: AdminBankClerkDetail },
        { path: 'bank-clerk/detail/edit', name: 'AdminBankClerkDetail', component: AdminBankClerkDetail }
      ]
    }
  ]
})

let Status = {
  getOrderStatus (value) {
    switch (value) {
      case 0: return '待接收'
      case 10: return '已接收'
      case 11: return '已撤销'
      case 20: return '同意贷款'
      case 21: return '拒绝贷款'
      case 30: return '已确认'
      case 31: return '已逾期'
      default: return ''
    }
  }
}

export {
  Status
}

let Valitor = {
  phoneValitor (value) {
    return /^1[0-9]{10}$/.test(value)
  },

  passwordValitor (value) {
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(value)
  },

  IDCardValitor (value) {
    return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
  },

  usccValitor (value) {
    return /^(?![A-Z]+$)[0-9A-Z]{18}$/.test(value)
  },

  verifyCodeValitor (value) {
    return /^[0-9]{4}$/.test(value)
  },

  usccInputValitor (value) {
    return value.replace(/[^A-Z0-9]/g, '')
  },

  phoneInputValitor (value) {
    return value.replace(/[^0-9-]/g, '')
  },

  numberValitor (value) {
    return value.replace(/\D/g, '')
  },

  numberAndWordValitor (value) {
    return value.replace(/[\W]/g, '')
  },

  numberAndPointValitor (value) {
    return value.replace(/[^\d.]/g, '')
  },

  ChineseAndLetterValitor (value) {
    return value.replace(/[^A-Za-z\u4e00-\u9fa5]/g, '')
  },

  wordValitor (value) {
    return value.replace(/[^A-Za-z0-9\u4e00-\u9fa5]/g, '')
  }
}

export {
  Valitor
}

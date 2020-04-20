export const COMMON_REG_INFO = {
  email: {
    reg: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
    msg: 'Please enter a valid email.',
  },
  phone: {
    reg: /^(\d){10}$/,
    msg: 'Please enter a valid phone number.',
  },
  notNull: {
    reg: /[^\s]/,
    msg: 'not null.',
  },
  strongPassword: { // 加强密码校验,
    reg: /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]).{6,20}$/,
    msg: 'Your password must be 6-20 characters, include a number, an uppercase letter and a lowercase letter.',
  },
  password: {
    reg: /.{6,20}$/,
    msg: 'Please enter a valid password.',
  },
  captcha: {
    reg: /^[A-Za-z0-9]{4}$/,
    msg: 'Please enter a valid captcha.',
  },
  verifyCode: {
    reg: /^(\d){6}$/,
    msg: 'Please enter a valid verification code.',
  },
}

export const REGEX_INFO = {
  cardNo: {
    reg: /^(\d){2}$/, // 必须为2位数字
    msg: 'Please enter a valid card number.',
  },
  cardNoNotSupport: {
    msg: 'We don\'t support this type of card, please try another.',
  },
  expireDate: {
    reg: COMMON_REG_INFO['notNull'].reg,
    msg: 'Please select a valid expiration date.',
  },
  securCode: {
    reg: /^(\d){3,4}$/,
    msg: 'Please enter a valid security code.',
  },
  upi: {
    reg: /^[^@]+@[^@]+$/,
    msg: 'Please enter a valid UPI.',
  },
  phoneNo8: {
    reg: /^(\d){8}$/,
    msg: COMMON_REG_INFO['phone'].msg,
  },
  phoneNo9: {
    reg: /^(\d){9}$/,
    msg: COMMON_REG_INFO['phone'].msg,
  },
  phoneNo10: {
    reg: /^(\d){10}$/,
    msg: COMMON_REG_INFO['phone'].msg,
  },
  phoneNo11: {
    reg: /^(\d){11}$/,
    msg: COMMON_REG_INFO['phone'].msg,
  },
  verifyCode: {
    reg: COMMON_REG_INFO['verifyCode'].reg,
    msg: COMMON_REG_INFO['verifyCode'].msg,
  },
}

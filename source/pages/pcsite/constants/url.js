/**
 * @file url.js
 * @Synopsis 接口地址
 */

export default {
  cart: '/v1/cart/item/get',
  cartDelete: '/v1/cart/item/delete',
  cartAdd: '/v1/cart/item/add',
  cartProductQtyUpdate: '/v1/cart/item/update',
  cartNum: '/v1/cart/item/count',
  index: '/v1/index',
  category: '/v1/category',
  categorySub (categoryId) {
    return `/v1/category/${categoryId}`
  },
  product: '/v1/product',
  cateProduct: '/v1/product/category',
  productDetail (productId) {
    return `/v1/product/${productId}`
  },
  discount: '/v1/themes',
  location: '/v1/location/by-ip',
  search: '/v1/product/search',
  login: '/v2/auth/login/',
  logout: '/v1/auth/logout',
  authLoginPassword: '/v2/auth/login/password',
  authLoginPasswordToken: '/v2/auth/login/password/token',
  captcha: '/v1/captcha',
  signUp: '/v2/auth/signup',
  verifyCode: '/v1/message/verification_code',
  forget: '/v1/auth/password',
  fbLogin: '/v1/auth/login/facebook',
  shippingInfo: '/v1/shipping/info',
  // pincode: '/v1/pincode',
  pincode: '/gw/cf-country/v1/countryInfo/zipCode',
  addAddress: '/v1/user/addresses',
  editAddress: '/v1/user/address',
  orderList: '/v1/orders/',
  paymentMethod (orderId) {
    return `/v2/payment/${orderId}/method`
  },
  paymentStart (orderId) {
    return `/v2/payment/${orderId}/start`
  },
  paymentQuickpayCreate (orderId) {
    return `/v2/payment/ocean/quickpay/${orderId}`
  },
  quickpayIds () {
    return `/v2/payment/ocean/quickpay/`
  },
  paymentBalance (orderId) {
    return `/v2/payment/${orderId}/start/balance/`
  },
  coupon: '/v1/coupon/',
  couponList: '/v1/coupons/',
  couponCheck: '/v1/coupon/check/',
  refundList (orderId) {
    return `/v1/order/refunds/${orderId}`
  },
  refundDetail (orderId, refundId) {
    return `/v1/order/refund/${orderId}/${refundId}`
  },
  track (orderId) {
    return `/v1/order/tracking/${orderId}`
  },
  comment: '/v1/review',
  sms: '/v1/user/order/sms',
  verifyCOD: '/v1/user/order/token',
  recommend: '/v3/product/search/related',
  themeEditorsPicks: '/v3/product/search/editors_picks',
  theme: '/v3/product/search/theme',
  codSms: '/v2/payment/sms/cod',
  cod (orderId) {
    return `/v2/payment/${orderId}/start/cod`
  },
  sysConf: '/v1/sys_conf',
  // 订单-订单详情-get
  ORDER_DETAIL: '/v1/order',
  ORDER_DETAIL_V2: '/v2/order',
  // 优惠券
  COUPON_APPLY: '/v2/act/coupon/obtain',
  COUPON_LIST_ORDER: '/v2/act/coupon/order',
}

const SERVICES = {
  // 支付订单相关
  CREATE_ORDER: '/gw/cf-buy/orderCreate',
  ORDER_PREVIEW: '/gw/cf-buy/orderPreview',
  PAYMENT_METHODS: '/gw/cf-buy/paymentMethod',
  PAYMENT_START: '/gw/cf-buy/paymentStart',
  PAYMENT_RESULT: '/gw/cf-buy/paymentResult',
  PAYMENT_STATE: '/gw/cf-buy/paymentState',
  SEX_UPDATE: '/v1/user/sex',
  GUEST_SMS: '/v1/user/order/sms',
  // 授信-检测验证列表-post
  SECURITY_VERIFY_LIST: '/gw/cf-auth/v1/security/method',
  // 授信-发送验证码-post
  GET_VERIFICATION_CODE: '/v1/message/auth_verification_code',
  // 授信-提交授信信息-post
  SECURITY_VERIFY_SUBMIT: '/gw/cf-auth/v1/security/verify',
  CATEGORY_FIRST: '/gw/cf-search/api/v1/categories/first',
  CATEGORY_IMAGE: categ_id => `/gw/cf-market/ad/category/image?categoryId=${categ_id}`,
  CATEGORY_SUB: categ_id => `/gw/cf-search/api/v1/categories/sub?firstCategoryId=${categ_id}`,
  CART_COUNT: '/gw/cf-cart/api/v1/cf-cart/cartCount',
  CART_ADD: '/gw/cf-cart/api/v1/cf-cart/addCart',
  AD_IMAGE: t => `/gw/cf-market/ad/image?type=${t}`,
  DETAIL_INFO: productId => `/gw/cf-detail/api/v1/product/info?productId=${productId}`,
  PRODUCT_DELIVERY_INFO: '/gw/cf-detail/api/v1/delivery',
  INDEX_PRODS: '/gw/cf-search/api/v1/index/products',
  CATEGORY_PROD: '/gw/cf-search/api/v1/category/products',
  DETAIL_COMMIT: '/gw/cf-detail/api/v1/comment',
  SEARCH_PRODS: '/gw/cf-search/api/v1/search/products',
  DETAIL_RELATE: pid => `/gw/cf-search/api/v1/relate/products?productId=${pid}`,
  SEARCH_HOTWORDS: '/gw/cf-search/api/v1/hotwords',
  APOLLO_CONFIG: '/gw/cf-client-config/v1/clientConfig',
  // 尺码表
  SIZE_CHART: '/gw/cf-detail/api/v1/size/chart',
}

module.exports.SERVICES = SERVICES
module.exports.URL = SERVICES

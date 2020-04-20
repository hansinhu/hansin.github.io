export const ERROR_MSG = {
  netWork: 'A network error occurred, please try again.',
  // 集赞
  freeProduct: (currency, amount) => `Orders with FREE product should be over ${currency}${amount}. Please add more products to the cart`,
  joinMission: 'Join mission failed.',
  createFailed: 'Create order failed.',
  orderAmountInvalid: ' Invalid order amount.',
  // 验证码
  sms_cod_invalid: 'Please enter a valid verification code',
  sms_verif_limit: 'Too many verification code errors.<br/>Please get a new code.',
  sms_cod_send_limit: 'Maximum get code attempts.<br/>Retry after 15 minutes.',
  // 50001
  purchaseLimit: 'Exceeding purchase limit. \n Please go back to check those items.',
  priceExpired: 'Price has expired，Please go back to check',
  notFriendsDeal: 'This product is not in Friends Deal.',
  perDeal: 'Only one item can be bought per deal.',
  inventoryNotEnough: 'The inventory is not enough，Please go back to check.',
  payFailed: {
    failed: 'something was wrong when we process your payment.' +
      'We suggest you change another card or another payment method to pay.',
    pending: 'It takes 24 hours to get your payment confirmed by your bank.' +
    'Please contact the customer service if your order is still unpaid after 1 day .' +
      'We suggest you change another card or another payment method to pay.',
    ptmBalanceInSufficient: 'Sorry,The balance of Paytm account is less than order value.You can change another payment method to pay.',
    ptmTokenInvalid: 'Something was wrong when we process your payment.We suggest you change another card or another payment method to pay.',
    codUnAvailable: 'You may not place another COD order if all of your 5 orders with COD are not fulfilled.',
  },
  // 提示ptm账户无效
  ptmPhoneAccount: (phoneLength) => {
    return `Please enter ${phoneLength} digits phone number.`
  },
  // 创建订单地址限制
  address_limit: 'Sorry, the item you ordered can\'t be shipped to your selected address',
  // 下单限流
  qpsLimit: 'The server is too tired. Please try again!',
  outOfDelivery: 'Your address is out of delivery service for this overweight item.Please delete it or change another address to continue.',
}

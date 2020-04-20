import axios from 'axios'
export default {
  // facebook 广告需求
  async getContentIds (content_ids) {
    const ids = await axios.get(`https://www.clubfactory.com/marketing/facebook/productTag/?productNoList=${content_ids.join(',')}`).then((resp) => { return resp.data })
    return ids
  },

  async facebookNeedToReport (contentId) {
    const bool = await axios.get('https://www.clubfactory.com/marketing/facebook/orderFilter/status', {
      params: {
        productNoList: contentId.join(','),
      },
    }).then((resp) => {
      return resp.data.status
    }).catch(err => {
      console.log(err)
    })
    return bool
  },

  init () {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      }
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = !0
      n.version = '2.0'
      n.queue = []
      t = b.createElement(e)
      t.async = !0
      t.src = v
      s = b.getElementsByTagName(e)[0]
      s.parentNode.insertBefore(t, s)
    }(window,
      document, 'script', 'https://connect.facebook.net/en_US/fbevents.js'))
    // Insert Your Facebook Pixel ID below.
    window.fbq('init', '212940676293900');
    window.fbq('init', '763200933862443');
  },

  sendPageView () {
    window.fbq('track', 'PageView')
  },

  /**
   * 加入购物车
   * @param {Object} param
   */
  async addToCart ({
    value,
    currency,
    contentName,
    contentIds,
    contents,
  }) {
    const ids = await this.getContentIds(contentIds)
    window.fbq('track', 'AddToCart', {
      value: value,
      currency: 'USD',
      content_name: contentName,
      content_type: 'product',
      content_ids: ids,
    })
  },

  async productDetail ({
    value,
    currency,
    contentName,
    contentIds,
  }) {
    const ids = await this.getContentIds(contentIds)
    window.fbq('track', 'ViewContent', {
      content_name: contentName,
      content_ids: ids,
      content_type: 'product',
      value: value,
      currency: 'USD',
    })
  },

  paymentSuccess ({
    value,
    contentName,
    contentIds,
  }) {
    // 打点防刷新===> fb没做去重，真是蛋疼
    const orderName = `order_${contentName}`
    if (localStorage.getItem(orderName)) return null
    localStorage.setItem(orderName, contentName)
    return this.getContentIds(contentIds).then(ids => {
      const params = {
        content_name: contentName,
        content_ids: ids,
        content_type: 'product',
        value: value,
        currency: 'USD',
      }
      if (window.fbq) {
        ['InitiateCheckout'].forEach(event_name => {
          window.fbq('track', event_name, params)
        })
      }
    })
  },
}

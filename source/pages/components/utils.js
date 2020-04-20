/**
 * @file 组件提供的工具函数
 */
import axios from '@/setup/axios'
import cesfun from '@/setup/cesfun'
import qs from 'qs'
import n from 'numeral'
import _ from 'lodash'
import { observe } from 'mobx'

import { REGEX_INFO } from '@/constants'

require('intersection-observer')

// cookie操作
const cookie = {
  setFacebookLogin: function () {
    Cookies.set('is_fb', true)
  },

  getFacebookLogin: function () {
    return Cookies.get('is_fb') === 'true';
  },

  setPhoneNum: function (num) {
    Cookies.set('pn', num)
  },

  getPhoneNum: function () {
    return Cookies.get('pn')
  },

  getVersion: function () {
    //    1.6.2
    const v = Cookies.get('v');
    if (v) {
      return v.split('_').pop();
    } else {
      return null;
    }
  },

  setCountryCode: function (country_code) {
    Cookies.set('country_code', country_code)
  },

  get country_code () {
    return Cookies.get('country_code') || 'in'
  },

  setGetIntoGroupLotteryMark: function () {
    Cookies.set('is_gi_gl', 'open')
  },

  getGetIntoGroupLotteryMark: function () {
    return Cookies.get('is_gi_gl')
  },

  setFirstWinGl: function (val) {
    Cookies.set('first_win_Gl', val)
  },

  getFirstWinGl: function () {
    return Cookies.get('first_win_Gl')
  },

  setDeviceId: function (val) {
    Cookies.set('android_id', val)
  },

  getDeviceId: function () {
    return Cookies.get('android_id')
  },

  getAndSetGroupLotteryHasPopShare: function (mission_id) {
    let missis_str = (Cookies.get('is_gl_pop_share') || '').replace(/%2C/ig, ',')
    let mission_ids = JSON.parse(missis_str || '[]')
    let hasPop = mission_ids.indexOf(mission_id) > -1
    if (!hasPop) {
      mission_ids.push(mission_id)
      Cookies.set('is_gl_pop_share', JSON.stringify(mission_ids))
    }
    return hasPop
  },
  get: Cookies.get,
  set: Cookies.set,

  isMidEast () {
    const mid_east = ['ae', 'om', 'kw', 'qa', 'bh', 'sa']
    const country_code = this.get('country_code')
    if (mid_east.indexOf(country_code) > -1) {
      return true
    }
    return false
  },
  setDefaultGender (visible) {
    utils.updateGender().then(() => {
      if (!['F', 'M'].includes(Cookies.get('gender'))) {
        Cookies.set('gender', 'F', { expires: 120 })
      }
    })
  },
}

// ga工具
const ga = {}

const utils = {
  // 解析json字符串
  parseJSON (str) {
    try {
      str = JSON.parse(str)
    } catch (e) {}
    return str
  },

  // 可视区域改变
  observe: (el, callback = throw new Error('observe needs callback!'), options) => {
    if (!el) {
      return
    }
    // 默认观察屏幕, 顶部延伸400px
    const config = Object.assign({}, {
      rootMargin: '400px 0px 0px',
      threshold: [Number.MIN_VALUE],
    }, options)

    new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        callback?.(entry, self)
      })
    }, config).observe(el)
  },

  // 获取当前日期
  getDate () {
    const d = new Date()
    return `${'0'}${d.getMonth() + 1}/${d.getDate()}`
  },

  getQuery (key = '', search) {
    let location_search = window.location.search
    // 对hash后的参数解析: 例如#/?id=1
    let hash = window.location.hash
    if (hash && hash.includes('?')) {
      location_search = location_search + '&' + hash.split('?')[1]
    }
    const query = qs.parse(search || location_search, {
      ignoreQueryPrefix: true,
    })
    return query[key] || query
  },

  setUTMData (ad_source = '', utm_data = {}) {
    const { utm_source, utm_medium, utm_campaign, utm_content } = utm_data
    const isSetAdSource = ad_source && utm_source
    const uri = window.location.href.split('?')[0]
    if (isSetAdSource) {
      const query = utils.getQuery()
      query.utm_medium = utm_medium
      query.utm_campaign = utm_campaign
      utm_content && (query.utm_content = utm_content)
      window.history.pushState({}, 0, `${uri}?${qs.stringify(query)}`);
    }
    return isSetAdSource
  },

  syncHistoryWithStore: (history, store) => {
    // Initialise store
    store.history = history
    // Handle update from history object
    const handleLocationChange = (location) => {
      store._updateLocation(location)
    }
    const unsubscribeFromHistory = history.listen(handleLocationChange)
    handleLocationChange(history.location)
    const subscribe = (listener) => {
      const onStoreChange = () => {
        const rawLocation = { ...store.location }
        listener(rawLocation, history.action)
      }
      // Listen for changes to location state in store
      const unsubscribeFromStore = observe(store, 'location', onStoreChange)
      listener(store.location, history.action)
      return unsubscribeFromStore
    }
    history.subscribe = subscribe
    history.unsubscribe = unsubscribeFromHistory
    return history
  },

  exp: {
    get (key: string): null|number {
      const mapCookie = 'experiment_map'
      const map = cookie.get(mapCookie)

      if (!map) {
        return null
      } else {
        let map_parsed = {}
        try {
          map_parsed = JSON.parse(map)
        } catch (err) {
          console.error(err)
          return null
        }

        if (map_parsed.xname === key) {
          return map_parsed.xvar | 0
        } else {
          return null
        }
      }
    },
  },

  ga,
  cookie,

  // mock
  dummyImg (...args /* size, bg, fg, format */) {
    if (args.length >= 4) {
      const [size, bg, fg, format] = args
      return `https://dummyimage.com/${size}/${bg}/${fg}.${format}`
    } else {
      return `https://dummyimage.com/${args.join('/')}`
    }
  },

  // android & >ios_5.0 use webp
  marshalImg (url, size) {
    const components = url.split('.')
    components.pop() // remove postfix
    return `${components.join('.')}_${size}.jpg`
  },

  clubImgUrl (url, size) {
    if (typeof url !== 'string') {
      return url
    }

    if (!size) {
      return url
    }
    // 此类url: https://s3.amazonaws.com/fromfactory.club.image/46/e1/46e487b1b76fb12e2fc8d35a3d1b36e1.jpg
    // 此类url: //img1.cfcdn.club/46/e1/46e487b1b76fb12e2fc8d35a3d1b36e1.jpg
    // 非此类url: //img1.cfcdn.club/46/e1/46e487b1b76fb12e2fc8d35a3d1b36e1_350x350.jpg
    const reg = /(^.*:){0,1}\/(\/[^/]+)+(\/[^/]{2}){2}\/\S+$/
    const urlWithSize = /\S+_\d+x\d+\.\S+/
    if (reg.test(url) && !urlWithSize.test(url)) {
      const last = /[^/]+$/
      const [name] = url.match(last) || []
      if (!name) {
        return url
      } else {
        let [n, postfix] = name.split('.')
        const imgWithSize = `${n}_${size}.${postfix}`
        return url.replace(last, imgWithSize)
      }
    } else {
      return url
    }
  },

  uuid () {
    let d = Date.now()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now()
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  },

  webClientIDGenerator () {
    const ts = Math.round(+new Date() / 1000.0);
    const rand = Math.round(Math.random() * 2147483647);
    return ['web', rand, ts].join('.');
  },

  // 邀请码GA打点
  gaInvite (action, label) {
    window?.ga('send', {
      hitType: 'event',
      eventCategory: 'InviteCode Share',
      eventAction: action,
      eventLabel: action + ' & ' + label,
      nonInteraction: true,
    })
  },

  validator (formData) {
    const result = {}
    for (let key in formData) {
      if (!REGEX_INFO[key]['reg'].test(formData[key])) {
        result[key] = REGEX_INFO[key]['msg']
      }
    }
    console.log('formData', formData)
    return result
  },

  trim (param) {
    return param.toString().replace(/\s/g, '')
  },

  cesfun,
  asyncLoadScript (url) {
    let s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = url
    let x = document.getElementsByTagName('script')[0]
    x.parentNode.insertBefore(s, x)
  },
  setPrice (obj = { price: 0, type: '' }) {
    const {
      price,
      type,
    } = obj
    // 印度，印度尼西亚，越南：金额取整，balance，coupon向下取整，其余皆向上取整 or 其他国家已由后端取整，前端不做处理
    const countryCode = cookie.get('country_code')
    let result = price
    if (['in', 'id', 'vn'].includes(countryCode)) {
      result = type && ['balance', 'coupon'].includes(type) ? Math.floor(price) : Math.ceil(price)
    } else {
      // 其余金额显示两位小数
      result = n(result).format('0.00')
    }
    return Number(result)
  },
  // 固定背景，控制ios上弹窗上的触摸穿透问题
  fixedBackground (visible) {
    if (visible) {
      document.getElementsByTagName('html')[0].setAttribute('class', 'fixed')
      return
    }
    document.getElementsByTagName('html')[0].removeAttribute('class')
  },
  // 首字母大写
  firstUpperCase (str) {
    if (!str || typeof str !== 'string') return ''
    return str.substring(0, 1).toLocaleUpperCase() + str.substring(1)
  },
  // '2017-4-1 17:32'
  formatDateMin (timestamp) {
    if (!timestamp) return '- - - -'
    let date = new Date(timestamp)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = (date.getHours() + '').padStart(2, '0')
    let min = (date.getMinutes() + '').padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${min}`
  },
  // 商品本地货币取值规则: http://wiki.yuceyi.com/pages/viewpage.action?pageId=27218480
  usPriceToLocal (usPrice = 0, rate = 1, country_code) {
    const c_code = country_code || cookie.get('country_code')
    // 向上取整的国家: 印度
    let ceil_country = ['in']
    // 四舍五入取整: 印度尼西亚 / 越南
    let round_country = ['id', 'vn']
    // 其余的取小数点后2位

    let localPrice = usPrice * rate
    let last_price = Math.round(localPrice * 100) / 100

    if (ceil_country.includes(c_code)) {
      last_price = Math.ceil(last_price)
    } else if (round_country.includes(c_code)) {
      last_price = Math.round(last_price)
    }
    return last_price
  },

  // 页面顺滑滚动，处理 behavior 兼容性问题
  /**
 * @param {object{left, top}} prams
 */
  smoothScroll (prams = {}) {
    const { left = 0, top = 0 } = prams
    try {
      window.scroll({
        behavior: 'smooth',
        top,
        left: 0,
      })
    } catch (err) {
      if (err instanceof TypeError) {
        window.scroll(left, top)
      } else {
        throw err
      }
    }
  },
}

if (process.env.NODE_ENV) {
  utils.toJS = require('mobx').toJS
  utils.axios = axios
  window.utils = utils
  window.update_gender = utils.updateGender
}

export default utils

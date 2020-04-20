import qs from 'qs'
import {
  COUNTRY_MAP,
} from '@/constants'

export function getCookie (...args) {
  return Cookies.get(...args)
}

export function setCookie (...args) {
  return Cookies.set(...args)
}

export function getLocalItem (key) {
  return localStorage.getItem(key)
}

export function setLocalItem (key, value) {
  localStorage.setItem(key, value)
}

export function removeLocalItem (key) {
  localStorage.removeItem(key)
}

/**
 * 保留原pc解析方式：获取解析后的token
 */
export function getDecodeToken () {
  const token = getAuthorization()
  try {
    const [a, b, c] = token.split('.')
    const decodeToken = JSON.parse(atob(b))
    return decodeToken
  } catch (error) {
    return {}
  }
}

/**
 * localStorage保存用户信息
 */
export function getUserInfo () {
  try {
    const user = localStorage.getItem('user')
    const userInfo = JSON.parse(user)
    return userInfo || {}
  } catch (error) {
    return {}
  }
}

export function getAuthorization () {
  return Cookies.get('Authorization')
}

// TODO 逐渐剔除cookie
export function setCountry (code) {
  Cookies.set('country_code', code, { expires: 365 })
}

export function getCountry () {
  const country_code = Cookies.get('country_code')
  // 老网站默认是美国，处理下
  if (!country_code) {
    setCountry('in')
  }
  return Cookies.get('country_code') || 'in'
}

export function setGender (gender) {
  setLocalItem('gender', gender)
}

export function getGender () {
  let gender = getLocalItem('gender') || Cookies.get('gender')
  if (!['F', 'M'].includes(gender)) {
    gender = ''
  }
  return gender
}

export function setLanguage (code) {
  setLocalItem('language', code)
  Cookies.set('language_code', code, { expires: 365 })
}

export function getLanguage () {
  return getLocalItem('language') || Cookies.get('language_code') || 'en-US'
}

export function getSymbol () {
  return COUNTRY_MAP[getCountry()]?.symbol || 'USD'
}

export function isMidEast () {
  var midEast = ['ae', 'om', 'kw', 'qa', 'bh', 'sa']
  return midEast.indexOf(getCountry()) > -1
}

export function logInCallBack (userInfo, redirect) {
  if (!userInfo?.authorization) return

  // 记录当前登录用户: 记录10个历史登录用户，用户快速登录和头像匹配
  localStorage.setItem('user', JSON.stringify(userInfo))
  let users = JSON.parse(localStorage.getItem('users_history') || '[]')
  const index = users.findIndex((item) => item.showAccount === userInfo.showAccount)
  if (index !== -1) {
    users.splice(index, 1)
  }
  if (userInfo.loginAccount) {
    users.unshift({
      loginAccount: userInfo.loginAccount,
      displayNickName: userInfo.displayNickName,
      showAccount: userInfo.showAccount,
      headIcon: userInfo.headIcon,
      loginPhone: userInfo.loginPhone,
      phoneAreaCode: userInfo.phoneAreaCode,
      loginEmail: userInfo.loginEmail,
      registerSource: userInfo.registerSource,
      loginBy: userInfo.loginBy,
    })
  }
  localStorage.setItem('users_history', JSON.stringify(users.slice(0, 10)))

  localStorage.setItem('user', JSON.stringify(userInfo))
  Cookies.set('Authorization', userInfo.authorization, { expires: 120 })
  if (redirect) {
    window.location.replace(redirect)
  } else {
    window.location.reload(true)
  }
}

export function logOutCallBack () {
  // domain: '.clubfactory.com' 处理老页面遗留问题
  Cookies.set('Authorization', '', { expires: new Date('1990-01-01'), domain: '.clubfactory.com' })
  Cookies.set('Authorization', '', { expires: new Date('1990-01-01') })
  localStorage.removeItem('user')
  window.location.reload(true)
}

export function createFunctionWithTimeout (func, timeout = 1000) {
  let flag = false
  const timer = setTimeout(() => {
    flag = true
    func()
  }, timeout)
  return () => {
    if (flag) {
      clearTimeout(timer)
      func()
    }
  }
}

export function convertImage (img, size, webp = false) {
  if (!img) return ''
  const index = img.lastIndexOf('.')
  return `${img.slice(0, index)}${size ? `_${size}x${size}` : ''}${
    webp ? '.webp' : `${img.slice(index)}`
  }`
}

export function getQuery (key = '', search) {
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
}

export function gtagViewItemList (products) {
  // gtag 衡量商品展示
  // https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_product_impressions
  const { gtag = () => {} } = window
  const items = products.map((item, idx) => {
    return {
      id: item.id,
      name: item.name || '',
      brand: `${item.productNo} & ${item.listPrice}`,
      category: item.categoryId,
      list_position: idx + 1,
      price: item.listPrice,
    }
  })
  gtag('event', 'view_item_list', {
    items,
  });
}

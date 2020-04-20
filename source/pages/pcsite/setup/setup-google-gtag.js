import {
  getCookie,
  getDecodeToken,
  getCountry,
  getLanguage,
  // createFunctionWithTimeout,
  getGender,
} from 'pc/tool'

export default {
  isMidEast: false,
  init (utmSource) {
    // 打点信息上传到fromfactory: !!! 已迁移至新的trace打点
    // const originSendBeacon = navigator.sendBeacon
    // navigator.sendBeacon = function (...args) {
    //   const [gtagPath, payLoad] = args
    //   // 上传
    //   let gifRequest = new XMLHttpRequest()
    //   let gifPath = 'https://ga.fromfactory.club/__ua.gif'
    //   gifRequest.open('GET', gifPath + '?' + payLoad, true)
    //   gifRequest.send()
    //   // 继续gtag
    //   return originSendBeacon.apply(this, args)
    // }

    const dataLayer = window.dataLayer = window.dataLayer || [];
    const gtag = window.gtag = function gtag () {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    const dimensionParams = this.initDimensions(utmSource)

    gtag('config', 'UA-71464937-7', {
      'transport_type': 'beacon', // 指定传输机制
      'custom_map': {
        'dimension2': 'email',
        'dimension3': 'utm_source',
        'dimension4': 'from_site',
        'dimension5': 'gender',
        'dimension6': 'country_code',
        'dimension8': 'uid',
        'dimension9': 'language',
      },
      ...dimensionParams,
    });

    var mid_east = ['ae', 'om', 'kw', 'qa', 'bh', 'sa'];
    var country_code = getCountry();
    this.isMidEast = mid_east.indexOf(country_code) > -1
  },
  initDimensions (utmSource) {
    let dimensionParams = {
      from_site: 'business',
      country_code: getCountry(),
    }
    const userProfile = getDecodeToken()
    // 当cookies  UID的值不为空时（会员标识）
    const email = userProfile.loginEmail
    if (email) {
      dimensionParams.email = email
    }
    // URL或者cookie中的utm_source(广告来源)
    utmSource = utmSource || getCookie('utm_source')
    if (utmSource) {
      dimensionParams.utm_source = utmSource
    }

    let gender = getGender()
    if (gender === 'M') {
      gender = 'men'
    } else if (gender === 'F') {
      gender = 'women'
    } else {
      gender = 'not set'
    }
    dimensionParams.gender = gender

    // 用户真实的uid
    const uid = userProfile.uid
    if (uid) {
      dimensionParams.uid = uid
    }

    // 自定义语言维度上报
    const language = getLanguage('language')
    if (language) {
      dimensionParams.language = language
    }
    return dimensionParams
  },
  // 上报页面
  sendPageView () {
    window.gtag('event', 'page_view', { 'send_to': 'UA-71464937-7' });
    if (this.isMidEast) {
      // window.gtag('event', 'page_view', { 'send_to': 'UA-71464937-3' });
    }
  },
}

import axios from 'axios'
import retryAxios from 'axios-retry'
import Sentry from '@/setup/sentry'
import { utils } from '@/pages/components'
import { getAuthorization, getLanguage, getCountry, getGender } from 'pc/tool'

const instance = axios.create()

retryAxios(instance, {
  retries: 5,
  retryDelay: retryAxios.exponentialDelay,
})

// api url
instance.defaults.baseURL = ''
// instance.defaults.timeout = 6000
// expect json response format
instance.defaults.headers.common['Accept'] = 'application/json'

instance.interceptors.request.use((config) => {
  let guest_id = Cookies.get('guest_id')

  if (!guest_id) {
    guest_id = utils.uuid()
    Cookies.set('guest_id', guest_id)
  }

  // 设备验证相关接口使用临时token tmp_authorization
  const tmp_auth_val = localStorage.getItem('tmp_authorization')
  const auth_val = config.is_tmp_auth && tmp_auth_val ? tmp_auth_val : getAuthorization()
  config.headers.common['Authorization'] = auth_val

  config.headers.common['X-Requested-With'] = 'XMLHttpRequest'
  config.headers.common['Client-Basic'] = JSON.stringify({
    country_code: getCountry(),
    language_code: getLanguage(),
    gender: getGender(),
    guest_id: guest_id,
    from_site: 'business',
    _ga: utils.cookie.get('_ga'),
    device_id: utils.cookie.get('device_id'),
  })
  return config
}, (error) => {
  Sentry.captureException(error, {
    extra: {
      info: error,
      logger: 'instance.request',
    },
    logger: 'instance.request',
  })
  return Promise.reject(error)
})

instance.interceptors.response.use((response) => {
  return response
}, (error) => {
  Sentry.captureException(error, {
    extra: {
      info: error,
      logger: 'msite.response',
    },
    logger: 'msite.response',
  })
  return Promise.reject(error)
})


export default instance

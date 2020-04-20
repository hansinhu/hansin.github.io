import * as Sentry from '@sentry/browser'

const ravenLink = ['app.', 'm.', 'cfshare.', 'cfshare1.', 'cf-share', 'share', 'ulink']
let sentryEnabled = false
if (ravenLink.some(function (el) {
  return window.location.host.indexOf(el) > -1
})) {
  sentryEnabled = true
}

const __DEBUG_SENTRY__ = Boolean(Cookies.get('__DEBUG_SENTRY__')) ?? false

// init
Sentry.init({
  dsn: 'https://fe43786e74fe41df9e4d127800bf272e@raven.clubfactory.com/9',
  // commit的版本号
  release: window.__SENTRY_RELEASE__ || '',
  sampleRate: __DEBUG_SENTRY__ ? 1 : 1, // TODO: 首页全放开
  debug: __DEBUG_SENTRY__,
  enabled: __DEBUG_SENTRY__ || sentryEnabled,
})

// set User
Sentry.configureScope(function (scope) {
  const id = Cookies.get('r_uid')
  const email = Cookies.get('uid')
  const gender = Cookies.get('gender')
  const country_code = Cookies.get('country_code')
  const v = Cookies.get('v')
  const language = Cookies.get('language')
  const model = Cookies.get('model')
  scope.setTag('country_code', country_code)
  scope.setTag('v', v)
  scope.setTag('language', language)
  scope.setTag('model', model)
  scope.setTag('gender', gender)

  scope.setUser({
    id, email,
  })

  // 记录cookie
  scope.setExtra('cookies', Cookies.get())
  // 记录网页性能
  if (window.performance) {
    const { memory, navigation, timing } = window.performance || {}
    scope.setExtra('performance.memory', memory)
    scope.setExtra('performance.navigation', navigation)
    scope.setExtra('performance.timing', timing)
  }
  // 记录网络情况
  if (navigator.connection) {
    scope.setExtra('navigator.connection', navigator.connection)
  }
})

if (process.env.CLUB_ENV !== 'prod') {
  window.Sentry = Sentry
}

export default Sentry

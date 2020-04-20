import Intl from 'cf-i18n'
// changeLanguage 用于更改业务组件库的language值
import { changeLanguage } from 'front-components'

const lang = Cookies.get('language') || 'en'

Intl.init({
  language: lang,
  resources: {
    en: {
      translation: require('@/locales/en.json'),
    },
    hi: {
      translation: require('@/locales/hi.json'),
    },
  },
})

changeLanguage(lang)

export default Intl

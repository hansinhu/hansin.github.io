import {
  COUNTRY_MAP,
} from '@/constants'

export const getMoreMenu = () => {
  return [
    {
      label: 'Find Guest Order',
      key: 'guest-order',
    },
    {
      label: 'Help Center',
      key: 'help-center',
    },
    {
      label: 'IPR Protection',
      key: 'complaint-guide',
    },
    {
      label: 'Download App',
      key: 'download',
    },
  ]
}

export const getUserMenu = (isLogin) => {
  let menu = [
    {
      label: 'My Order',
      key: 'my-order',
    },
    {
      label: 'Log in/Sign up',
      key: 'login',
    },
  ]
  if (isLogin) {
    menu.splice(1, 1, {
      label: 'Log out',
      key: 'logout',
    })
  }
  return menu
}

export const getLanguageMenu = () => {
  return [
    { code: 'en-US', language: 'English' },
    { code: 'hi-IN', language: 'हिंदी' },
    { code: 'es-MX', language: 'Español' },
    { code: 'ar', language: 'عربى' },
    { code: 'pt-BR', language: 'Português' },
    { code: 'id', language: 'bahasa Indonesia' },
    { code: 'it', language: 'Italian' },
  ]
}

export const getCountryMenu = () => {
  return Object.keys(COUNTRY_MAP).map(code => {
    return Object.assign({
      label: COUNTRY_MAP[code].name,
      key: code,
      img: require(`@/img/flags/${code}.jpg`),
    }, COUNTRY_MAP[code])
  })
}


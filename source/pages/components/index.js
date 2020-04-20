import stores from '@/pages/pcsite/store'
import { TraceController } from '@/pages/components'

export const GENDER_MAP = {
  F: 'Female',
  M: 'Male',
}

export default {
  /**
   * 这个函数用来做m站跳转
   *
   * @name open
   * @function
   * @param {string} url 跳转路径
   * @param {bool} legacy=false 默认是false，如果是true的话，用window.location.href跳
   * @flow
   */
  open: (url, legacy = false) => {
    if (legacy) {
      window.location.href = url
    } else {
      stores.router.push(url)
    }
  },

  clubImgUrl: (url, size) => {
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
      const res = url.match(last) || []
      if (!res[0]) {
        return url
      } else {
        let [n, postfix] = res[0].split('.')
        const imgWithSize = `${n}_${size}.${postfix}`
        return url.replace(last, imgWithSize)
      }
    } else {
      return url
    }
  },
}

export const trace = new TraceController(5)
export { default as Input } from './input'
export { default as InputItem } from './input-item'
export { default as InputNumber } from './input-number'
export { default as InputVerifyCode } from './input-verify-code'
export { default as AutoComplete } from './auto-complete'
export { default as Checkbox } from './checkbox'
export { default as Radio } from './radio'
export { default as Button } from './button'
export { default as Collapse } from './collapse'
export { default as Modal } from './modal'
export { default as Message } from './message'
export { default as Tabs } from './tabs'
export { default as DateSelect } from './date-select'
export { default as Select } from './select'
export { default as Rating } from './rating'
export { default as ToolTip, StatefulToolTip } from './tool-tip'
export { default as ToggleMenu } from './toggle-menu'
export { default as LoadingIcon } from './loading-icon'
export { default as Pagination } from './pagination'
export { default as LazyImg } from './lazy-img'
// 通用页面组件
export { default as SimpleLayout } from './layout/simple-layout'
export { default as SimpleHeader } from './layout/simple-layout/SimpleHeader'
export { default as DefaultLayout } from './layout/page-layout'
export { default as PageHeader } from './layout/page-layout/PageHeader'
export { default as PageFooter } from './layout/page-layout/PageFooter'
export { default as CategoryMenu } from './category-menu'
export { default as CategoryBanner } from './category-banner'
export { default as ToolbarSide } from './toolbar-side'
export { default as GenderModal } from './gender-modal'
export { default as FindGuestOrderModal } from './find-guest-order'
export { default as LoginSignupModal, FbLoginBtn, GgLoginBtn, GgAndFbLogin, InputWidthEmail } from './login-signup'
export { default as OrderProduct } from './order-product'
export { default as AddressForm } from './address-form'
export { default as AddressInfo } from './address-info'
export { default as SummaryList } from './summary-list'
export { default as CouponItem } from './coupon-item'
export { default as ProductItem } from './product-item'
export { default as ProductList } from './product-list'
export { default as ListEmpty } from './ListEmpty'
export { default as CodVerifyModal } from './cod-verify-modal'
export { default as VoiceCodeTips } from './voice-code-tips'
export { default as ModalHeader } from './modal-header'
export { default as CaptchaModal } from './captcha-modal'

// 基础组件
export { default as Icon } from './Icon'
export { default as Copy } from './Copy'
export { default as Intl } from './Intl'
export { default as utils } from './utils'
export * from './Trace'

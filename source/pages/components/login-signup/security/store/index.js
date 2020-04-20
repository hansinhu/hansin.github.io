/*
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-07-01 16:20:48
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-12-04 19:43:36
 */

import { observable, action } from 'mobx'
import { SERVICES } from '@/constants'
import { utils } from '@/pages/components'
import axios from '@/setup/axios'

class SecurityStore {
  constructor (_params) {
    const { site } = utils.getQuery()
    this.site = site
  }
  @observable loading = true
  @observable verify_code_loading = false
  @observable security_list = []
  icon_map = {
    '1': 'PhoneCode',
    '2': 'Emailacode',
    '3': 'Orderinformation',
    '4': 'Orderinformation',
    '5': 'Facebook',
    '6': 'Google',
  }
  /**
   * 获取授信列表
   */
  @action.bound
  async getSecurityList (range = 1) {
    this.loading = true
    const params = { methodRange: range }
    try {
      const { data } = await axios.post(SERVICES.SECURITY_VERIFY_LIST, params, { is_tmp_auth: true })
      let list = data?.body || []
      const filterList = list.filter(item => {
        return !(item.methodType === 4 && list.some(item => item.methodType === 3))
      })
      this.security_list = filterList
        .sort((a, b) => a.methodType - b.methodType) // 3/4是重复的
        .map(item => {
          item.icon = this.icon_map[`${item.methodType}`]
          item.type = item.methodType
          if (item.methodType === 1) {
            item.title = `Send a code to +${item.phoneCode} ${item.phoneNum}`
          } else if (item.methodType === 2) {
            item.title = `Email a code to ${item.email}`
          } else if (item.methodType === 3 || item.methodType === 4) {
            item.title = 'Enter your history order information'
          } else if (item.methodType === 5) {
            item.title = 'Login with Facebook'
          } else if (item.methodType === 6) {
            item.title = 'Login with Google'
          }
          item.disable = !item.available
          item.disableReason = item.unavailableReason || -1 // 1: 新绑定账号不超过24小时 2: 24小时内发送验证码过多
          return item
        })
      this.loading = false
      // mock
      // this.security_list = this.security_list.concat([
      //   {
      //     type: 1,
      //     phoneCode: '91',
      //     phone: '1234567890',
      //   },
      //   {
      //     type: 3,
      //   },
      //   {
      //     type: 5,
      //   },
      //   {
      //     type: 6,
      //   },
      // ])
      return this.security_list
    } catch (err) {
      this.loading = false
      const error_msg = err?.response?.data?.message || err?.message || 'Network is unstable. Please try again'
      throw new Error(error_msg)
    }
  }
  /* 获取验证码 */
  @action.bound
  async getVerifyCode (seItem, phoneCodeType) {
    const params = {
      // 8 邮箱，9 手机
      send_type: seItem.type === 2 ? 8 : 9,
    }
    if (seItem.type === 1) {
      params.send_method = phoneCodeType // 1：短信 2：语音
    }
    return axios.post(SERVICES.GET_VERIFICATION_CODE, params, { is_tmp_auth: true })
  }
  @action.bound
  submitVerifyInfo = (params) => {
    let subParams = Object.assign({
      creditSource: 1, // 1：登陆页面， 2:提现页面
    }, params)
    return axios.post(SERVICES.SECURITY_VERIFY_SUBMIT, subParams, { is_tmp_auth: true })
  }
  @action.bound
  setDisableItem = (type) => {
    this.security_list = this.security_list.map(item => {
      if (item.type === type) {
        item.disable = true
      }
      return item
    })
  }
}

export default SecurityStore

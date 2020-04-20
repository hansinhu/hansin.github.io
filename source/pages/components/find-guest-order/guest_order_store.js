/*
 * @file 游客查单 store
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-10-15 15:54:35
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2020-04-03 15:36:41
 */

import { action, observable } from 'mobx'
import { COMMON_REG_INFO, REGEX_INFO, COUNTRY_MAP, SERVICES } from '@/constants'
import axios from '@/setup/axios'
import { URL } from 'pc/constants';
import { Message } from '@/pages/components'
import { getCountry } from 'pc/tool'

class GuestOrderStore {
  constructor () {
    this.countryCode = getCountry() || 'in'
    this.countryInfo = COUNTRY_MAP[this.countryCode]
    this.phoneLen = this.countryInfo.phoneLength
    this.phoneCode = `${this.countryInfo.phonePrefix}` // 字符串格式
    this.phoneCodeTimer = null
  }

  @observable submitLoading = false
  @observable guestOrderForm = {
    phone: '',
    orderName: '',
    verifyCode: '',
    codeSending: false,
    codeSended: false,
    codeSeconds: 0,
    phoneMsg: '',
    orderMsg: '',
    codeMsg: '',
  }

  @action.bound
  changeFormItem (key, val) {
    const [key1, key2] = key.split('.')
    this[key1][key2] = val
  }

  @action.bound
  submitOrderInfo () {
    if (this.submitLoading) return
    // 校验手机格式
    const { verifyCode: codeReg } = COMMON_REG_INFO
    const { phone, verifyCode, orderName } = this.guestOrderForm
    const orderReg = /^SO[0-9]+$/i
    const orderNameFormated = orderName.replace(/^\s+|\s+$/g, '').toUpperCase()
    const phoneReg = REGEX_INFO[`phoneNo${this.phoneLen}`]
    this.guestOrderForm.phoneMsg = phoneReg.reg.test(phone) ? '' : phoneReg.msg
    this.guestOrderForm.codeMsg = codeReg.reg.test(verifyCode) ? '' : codeReg.msg
    this.guestOrderForm.orderMsg = orderReg.test(orderNameFormated) ? '' : 'Please enter a valid order number.'
    if (this.guestOrderForm.phoneMsg || this.guestOrderForm.codeMsg || this.guestOrderForm.orderMsg) return

    // 校验通过
    this.submitLoading = true
    const params = {
      verification: verifyCode,
      phone: phone,
      country_code: this.countryCode,
      order_name: orderNameFormated,
    }
    return axios.get(URL.verifyCOD, { params })
      .then((res) => {
        const { token, message } = res.data
        if (token) {
          window.location.href = `/order/detail?orderId=${orderNameFormated}&type=detail&token=${token}`
        } else {
          Message.error(message)
        }
      }).finally(() => {
        this.submitLoading = false
      }).catch((err) => {
        const { message } = err.response.data
        Message.error(message)
      })
  }

  @action.bound
  getPhoneVerifyCode () {
    const { phone, codeSending, codeSeconds, orderName } = this.guestOrderForm
    const orderNameFormated = orderName.replace(/^\s+|\s+$/g, '').toUpperCase()
    if (codeSending || codeSeconds || !orderNameFormated) return
    // 校验手机格式
    const phoneReg = REGEX_INFO[`phoneNo${this.phoneLen}`]
    this.guestOrderForm.phoneMsg = phoneReg.reg.test(phone) ? '' : phoneReg.msg
    if (this.guestOrderForm.phoneMsg) {
      return
    }
    this.guestOrderForm.codeSending = true
    const params = {
      order_name: orderNameFormated,
      phone: phone,
      country_code: this.countryCode,
    }
    return axios.post(SERVICES.GUEST_SMS, params).then((res) => {
      const time_to_wait = res?.data?.wait?.time_to_wait
      if (time_to_wait) {
        this.guestOrderForm.codeSended = true
        this.guestOrderForm.codeSeconds = time_to_wait
        if (time_to_wait === 900) {
          Message.error('You have reached maximum requests for verification code. Please try in 15 minutes.', 3000)
        }
        if (this.phoneCodeTimer) clearInterval(this.phoneCodeTimer)
        this.phoneCodeTimer = setInterval(() => {
          if (this.guestOrderForm.codeSeconds <= 0) {
            clearInterval(this.phoneCodeTimer)
          } else {
            this.guestOrderForm.codeSeconds = this.guestOrderForm.codeSeconds - 1
          }
        }, 1000)
      }
    }).finally(() => {
      this.guestOrderForm.codeSending = false
    }).catch((error) => {
      const message = error.response?.data?.message
      Message.error(message || 'Network Error')
    })
  }
}

export default new GuestOrderStore()

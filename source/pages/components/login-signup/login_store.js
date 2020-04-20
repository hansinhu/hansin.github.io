/*
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-08-05 15:05:36
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-11-28 15:46:35
 */

import { action, observable } from 'mobx'
import axios from '@/setup/axios'
import URL from 'pc/constants/url';
import { Message } from '@/pages/components'
import { logOutCallBack, getCountry } from 'pc/tool'

class LoginStore {
  constructor () {
    this.countryCode = getCountry() || 'in'
  }

  @observable loginRedirect = ''
  @observable modalContentType = 'login'

  @action.bound
  logOut = () => {
    return axios.post(URL.logout).then(res => {
      logOutCallBack()
    }).catch(err => {
      Message.error(err.message || 'Network Error')
    })
  }
}

export default new LoginStore()

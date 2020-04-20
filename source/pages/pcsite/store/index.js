/*
 * @Author: xiaomanshi
 * @Date: 2019-07-04 19:13:43
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2020-04-20 15:56:24
 */

import storeCreate from '@/stores'
import CommonStore from './common_store'
import HomeStore from 'pc/home/home_store'

import { CodVerifyStore } from 'front-components'
import axios from '@/setup/axios'

const stores = storeCreate({
  common_store: new CommonStore(),
  home_store: new HomeStore(),
})

export default stores

export const cod_verify_store = new CodVerifyStore({
  Axios: axios,
})

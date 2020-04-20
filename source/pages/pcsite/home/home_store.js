import { observable, action } from 'mobx'
import axios from '@/setup/axios'

import n from 'numeral'
import { SERVICES } from '@/constants'
import { gtagViewItemList } from 'pc/tool'

export default class HomeStore {
  @observable banners = []
  @observable isReady = false
  @observable isBannerReady = false
  @observable products = []
  @observable is_loading_more = false
  @observable currentPage = 0
  @observable loadMore = true

  @action.bound
  getBanners () {
    return axios.get(SERVICES.AD_IMAGE(4))
      .then(({ data }) => {
        if (data?.body?.adResourceList) {
          this.banners = data.body.adResourceList
        }
      }).finally(() => {
        this.isBannerReady = true
      }).catch(() => {
      })
  }

  @action.bound
  listInit () {
    this.isReady = false
    this.isBannerReady = false
    this.products = []
    this.is_loading_more = false
    this.currentPage = 0
    this.loadMore = true
  }

  @action.bound
  getProducts () {
    const pageSize = 40
    if (this.is_loading_more) {
      return
    }
    this.is_loading_more = true
    const url = `${SERVICES.INDEX_PRODS}?pageSize=${pageSize}&offset=${this.currentPage * pageSize}`

    return axios.get(url)
      .then(({ data }) => {
        if (data?.body?.products) {
          let products = data.body.products.map(product => {
            product['off'] = product.off === 0 ? 0 : `${n(product.off).format('0%')}`
            return product
          })
          this.products.push(...products)
          this.currentPage++
          // 兼容处理: cf-search 与 大数据 商品信息(redis)不同步
          if (!products.length) {
            this.loadMore = false
          }

          // gtag 衡量商品展示
          gtagViewItemList(products)
        }
      }).finally(() => {
        this.is_loading_more = false
        this.isReady = true
      }).catch(() => {
      })
  }
}

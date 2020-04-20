import { observable, action, computed } from 'mobx'
import axios from '@/setup/axios'
import { utils } from '@/pages/components'
import { SERVICES } from '@/constants'
import {
  getGender,
} from 'pc/tool'

const categoryIcon = {
  51: 'women_clothing',
  52: getGender() === 'M' ? 'women_shoes' : 'men_shoes',
  53: 'men_clothing',
  55: 'jewelry_accessories',
  56: 'home_living',
  57: 'electronics',
  58: 'beauty_health',
  59: getGender() === 'M' ? 'women_bags' : 'men_bags',
  60: 'kids_baby',
  61: 'watches',
  63: 'office',
  64: 'sports_fitness',
  65: 'automotive',
  'default': 'Categories1',
}

export default class CommonStore {
  @observable getAllCategory = true
  @observable cartNum = 0
  @observable firstCategories = []
  @observable categoryIsReady = false
  @observable banner = ''
  @observable secondCategories = []
  @observable breadCategoryId = null
  @observable loginModalVisible = !!utils.getQuery()['is_login']

  constructor () {
    // 兜底去掉游客单
    this.noGuest = window.noGuest !== 'false'
    this.login_redirect = ''
  }

  @computed
  get getBreadList () {
    if (!this.breadCategoryId) {
      return []
    }
    const deepEach = (cateArr, breadList = [], breadIds = []) => {
      cateArr.forEach(currentCate => {
        if (`${this.breadCategoryId}`.startsWith(`${currentCate.id}`)) {
          const copybreadIds = JSON.parse(JSON.stringify(breadIds))
          copybreadIds.push(currentCate.id)
          breadList.push({
            name: currentCate.name,
            id: currentCate.id,
            ids: copybreadIds,
          })
          if (currentCate.children) {
            deepEach(currentCate.children, breadList, copybreadIds)
          }
        }
      })
      return breadList
    }

    return deepEach(this.firstCategories, [], [])
  }

  @action.bound
  getCartNum () {
    return axios.get(SERVICES.CART_COUNT)
      .then(({ data }) => {
        if (data?.body?.entriesCount >= 0) {
          this.cartNum = data.body.entriesCount
        }
      }).catch(() => {
      })
  }

  // 合并游客订单[copy msite]
  @action
  guestMergeCart = () => {
    return axios.post('/gw/cf-cart/api/v1/cf-cart/guestMergeCart')
  }

  @action.bound
  setBreadCategoryId (id) {
    this.breadCategoryId = id
  }

  @action.bound
  getFirstCategories () {
    return axios.get(SERVICES.CATEGORY_FIRST)
      .then(({ data }) => {
        let firstList = data?.body?.firstCategories?.map(first => {
          first.icon = categoryIcon[first.id] || categoryIcon.default
          return first
        })
        if (firstList) {
          this.firstCategories = firstList
          if (this.getAllCategory) {
            const promiseList = firstList.map(firstItem => {
              return this.getSecondCategories(firstItem.id)
            })
            Promise.all(promiseList).then(secondList => {
              secondList.forEach(secondItem => {
                firstList = firstList.map(item => {
                  if (item.id === secondItem.categ_id) {
                    item = Object.assign({
                      ...secondItem.data,
                      children: secondItem.secondCategories,
                      secondCategories: secondItem.secondCategories,
                    }, item)
                  }
                  return item
                })
              })
              this.firstCategories = firstList
            })
          }
        }
      }).finally(() => {
        this.categoryIsReady = true
      }).catch(() => {
      })
  }

  @action.bound
  getBanner (categ_id) {
    return axios.get(SERVICES.CATEGORY_IMAGE(categ_id))
      .then(({ data }) => {
        if (data?.body?.adResourceList) {
          this.banner = data.body.adResourceList[0]
        }
      }).catch(() => {
      })
  }

  @action.bound
  getSecondCategories (categ_id) {
    let firstList = this.firstCategories
    this.banner = ''
    this.secondCategories = []
    return axios.get(SERVICES.CATEGORY_SUB(categ_id))
      .then(({ data }) => {
        if (data?.body?.secondCategories) {
          // 过滤点All和Hot Categories
          const secondCategories = data.body.secondCategories
            .filter(item => {
              // 过滤掉ALL
              return item.id !== categ_id
            })
            .map(item => {
              const thirdCategories = item.thirdCategories?.filter(third => {
                return third.id !== item.id
              }).sort((a, b) => {
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              })

              item.children = thirdCategories
              item.thirdCategories = thirdCategories
              return item
            })
          firstList = firstList.map(item => {
            if (item.id === categ_id) {
              item = Object.assign({
                ...data.body,
                children: secondCategories,
                secondCategories: secondCategories,
              }, item)
            }
            return item
          })
          if (this.getAllCategory) {
            return {
              categ_id,
              secondCategories,
              data: data.body,
            }
          } else {
            this.firstCategories = firstList
          }
        }
      }).catch(() => {
      })
  }

  @action
  toggleLoginModal (visible, login_redirect) {
    this.loginModalVisible = visible
    this.login_redirect = login_redirect || ''
  }
}

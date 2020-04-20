/*
 * @file 类目导航
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-10-15 15:50:08
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2020-04-14 10:09:18
 */

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { LoadingPlaceholder } from 'cf-ui-mobile'
import { Icon } from '@/pages/components'
import * as styles from './index.less'

@inject('common_store')
@observer
class CategoryMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      firstItemId: null,
      subShow: false,
    }
  }
  static propTypes = {
    categoryShadow: PropTypes.bool,
    history: PropTypes.object.isRequired,
    common_store: PropTypes.object.isRequired,
    className: PropTypes.string,
    cateListClassName: PropTypes.string,
  }

  componentWillMount () {
    const { getFirstCategories, firstCategories } = this.props.common_store
    if (!firstCategories.length) {
      getFirstCategories()
    }
  }

  getSubCategory = (item) => {
    this.setState({
      firstItemId: item.id,
    })
    const { firstCategories, getAllCategory } = this.props.common_store
    const subCategory = firstCategories.find(firstItem => {
      return firstItem.id === item.id && !!firstItem.secondCategories
    })
    if (subCategory && getAllCategory) return
    // 不存在subCategory则请求接口
    this.props.common_store.getSecondCategories(item.id)
  }

  menuItemClick = (...args) => {
    this.setState({ subShow: false })
    const ids = args.filter(item => !!item && item !== 1).join('/')
    this.props.history.push(`/categories/${ids}`)
  }

  mouseOverFirstItem = (category) => {
    this.getSubCategory(category)
  }

  bannerClick = (currentItem) => {
    const bannerLink = currentItem.bannerRedirectUrl
    if (bannerLink) {
      window.open(bannerLink)
    }
  }

  menuDelayShow = () => {
    this.menuShowTimer = setTimeout(() => {
      this.setState({ subShow: true })
    }, 300)
  }

  menuLeave = () => {
    if (this.menuShowTimer) clearTimeout(this.menuShowTimer)
    this.setState({ subShow: false })
  }

  render () {
    const { firstCategories, categoryIsReady } = this.props.common_store
    const { firstItemId, subShow } = this.state
    const currentItem = firstCategories.find(firstItem => {
      return firstItem.id === firstItemId
    })
    const secondCategories = currentItem?.secondCategories
    const showBanner = false // 活动页暂不支持pc，banner隐藏
    return <LoadingPlaceholder
      ready={categoryIsReady}
      customBlocks={<div className={styles.category_placeholer_block}></div>}
    >
      <div
        className={classNames(styles.category_menu, this.props.className)}
        onMouseOver={this.menuDelayShow}
        onMouseLeave={this.menuLeave}
      >
        <ul
          className={classNames(styles.category, this.props.cateListClassName, { [styles.category_shadow]: !!this.props.categoryShadow })}
        >
          {
            firstCategories.map((category, idx) => {
              return <li
                key={idx}
                className={classNames(styles.category_item, { [styles.active_first_item]: category.id === firstItemId })}
                onMouseOver={() => this.mouseOverFirstItem(category)}
                onClick={() => { this.menuItemClick(category.id) }}
              >
                <Icon className={styles.cate_icon} name={category.icon} /> {category.name}</li>
            })
          }
        </ul>
        {/* 当secondCategory.len > 5 宽度增加 */}
        <div
          className={classNames(styles.subcategory,
            {
              [styles.sub_show]: subShow,
              [styles.subcategory_lg]: secondCategories?.length > 5,
            }
          )}
        >
          <div className={styles.subcategory_list}>
            {
              secondCategories?.map((subCate, idx) => {
                return <div key={idx} className={styles.subcategory_item}>
                  <div
                    onClick={() => { this.menuItemClick(firstItemId, subCate.id) }}
                    className={styles.sub_title}
                  >{subCate.name}</div>
                  {
                    subCate.thirdCategories && subCate.thirdCategories.length
                      ? <ul className={styles.third_list}>
                        {
                          subCate.thirdCategories?.map((thridCate, idx) => {
                            return <li
                              key={idx}
                              className={styles.third_item}
                              onClick={() => { this.menuItemClick(firstItemId, subCate.id, thridCate.id) }}
                            >{thridCate.name}</li>
                          })
                        }
                      </ul>
                      : null
                  }
                </div>
              })
            }
          </div>
          {
            currentItem?.bannerImageUrl && showBanner ? <img onClick={() => { this.bannerClick(currentItem) }} src={currentItem.bannerImageUrl} /> : null
          }
          <div></div>
        </div>
      </div>
    </LoadingPlaceholder>
  }
}
export default withRouter(CategoryMenu)

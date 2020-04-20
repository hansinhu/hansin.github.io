/*
 * @file CategoryBanner
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-10-15 15:48:56
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2020-04-14 10:12:52
 */

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames'
import { Icon, CategoryMenu } from '@/pages/components'
import * as styles from './index.less'

@inject('common_store')
@observer
class CategoryBanner extends React.Component {
  static propTypes = {
    common_store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    extra: PropTypes.node,
    breadCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  constructor (props) {
    super()
    this.state = {
      showMenu: false,
    }
  }

  currentCategoryId = null
  menuTimer = null

  componentDidMount () {
    const { breadCategoryId, common_store } = this.props
    common_store.setBreadCategoryId(breadCategoryId)
  }

  componentWillReceiveProps (nextProps) {
    const { breadCategoryId, common_store } = this.props
    if (breadCategoryId !== nextProps) {
      common_store.setBreadCategoryId(nextProps.breadCategoryId)
    }
    const { firstId, secondId, thirdId } = nextProps.match.params
    const nextSearchId = thirdId || secondId || firstId
    if (nextSearchId !== this.currentCategoryId) {
      this.currentCategoryId = nextSearchId
      this.setState({
        showMenu: false,
      })
    }
  }

  breadItemClick = (item) => {
    this.props.history.push(`/categories/${item.ids.join('/')}`)
  }

  showMenu = () => {
    this.setState({
      showMenu: true,
    })
  }

  hiddenMenu = () => {
    if (this.menuTimer) clearTimeout(this.menuTimer)
    this.setState({ showMenu: false })
  }

  render () {
    const { getBreadList } = this.props.common_store
    return <div className={styles.category_banner}>
      <div className={styles.category_content}>
        <div
          className={
            classNames(styles.category_warp, {
              [styles.category_show]: this.state.showMenu,
            })
          }
          onMouseMove={this.showMenu}
          onMouseLeave={this.hiddenMenu}
        >
          <div className={styles.btn}>
            <Icon
              name='liebiao2'
              className={styles.cate_icon}
            />All Categories
          </div>
          <div className={styles.category_toggle}>
            <CategoryMenu
              className={styles.product_category}
              cateListClassName={styles.product_cate_list}
              categoryShadow
            />
          </div>
        </div>
        {
          this.props.extra ? <div className={styles.extra}>
            {this.props.extra}
          </div> : null
        }
        {
          getBreadList.length ? <div className={styles.extra}>
            {
              getBreadList.map((bread, i) => {
                return <span
                  className={styles.bread_item}
                  key={i}
                  onClick={() => { this.breadItemClick(bread) }}
                >
                  {bread.name}
                  {i !== getBreadList.length - 1 ? ' / ' : ''}
                </span>
              })
            }
          </div> : null
        }
      </div>
    </div>
  }
}
export default withRouter(CategoryBanner)

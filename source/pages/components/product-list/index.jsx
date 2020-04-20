import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import VisibilitySensor from 'react-visibility-sensor'

import { LoadingPlaceholder } from 'cf-ui-mobile'

import * as styles from './index.less'
import { Icon, ProductItem } from '@/pages/components'

class ProductList extends React.Component {
  static propTypes = {
    products: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    is_loading: PropTypes.bool,
    scrollToEnd: PropTypes.func,
    ready: PropTypes.bool,
    load_more: PropTypes.bool,
    listEmptyComponent: PropTypes.func,
    lineCount: PropTypes.number,
  }

  static defaultProps = {
    is_loading: false,
    ready: true,
    load_more: false,
    listEmptyComponent: () => <span></span>,
    lineCount: 4,
  }

  scrollToEnd = (isVisible) => {
    if (isVisible) {
      this.props.scrollToEnd()
    }
  }

  renderPlaceholder = () => {
    const { lineCount } = this.props
    const itemClassName = lineCount === 5 ? styles.larg_p_item : null
    const imgClassName = lineCount === 5 ? styles.larg_p_img : null
    const pwarpCls = classNames(styles.placeholderItem, styles.p_item_warp, [styles[`item_${lineCount}`]])
    const itemCls = classNames(styles.item, itemClassName)
    const imgCls = classNames(styles.img, imgClassName)
    return <div className={styles.productList}>
      {
        [...Array(lineCount * 2)].map((item, index) => {
          return (
            <div key={index} className={pwarpCls}>
              <div className={itemCls}>
                <div className={imgCls}>
                  <Icon name='CartIndia-Logo' className={styles.logo} />
                </div>
                <div className={styles.info}>
                  <div className={styles.text} />
                  <div className={styles.text} />
                  <div className={styles.text} />
                  <div className={styles.text} />
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  }

  render () {
    const {
      products,
      is_loading,
      ready,
      load_more,
      listEmptyComponent,
      lineCount,
    } = this.props
    const pwarpCls = classNames(styles.p_item_warp, [styles[`item_${lineCount}`]])
    const itemClassName = lineCount === 5 ? styles.larg_p_item : null
    const imgClassName = lineCount === 5 ? styles.larg_p_img : null
    return (
      <LoadingPlaceholder
        ready={ready}
        customBlocks={this.renderPlaceholder()}
      >
        { products.length > 0
          ? <>
            <div className={styles.productList}>
              { products.map((item, index) => {
                return <div
                  key={index}
                  className={pwarpCls}>
                  <ProductItem
                    className={itemClassName}
                    imgClassName={imgClassName}
                    product={item}
                    listPosition={index + 1}
                  />
                </div>
              }) }
            </div>
            { load_more && <VisibilitySensor
              onChange={this.scrollToEnd}
              partialVisibility={true}
              offset={{ top: 200 }}>
              <div className={styles.loadingGif}>
                {is_loading && <img src={require('@/img/ajax-loader.gif')}></img>}
              </div>
            </VisibilitySensor> }
          </>
          : listEmptyComponent() }
      </LoadingPlaceholder>
    )
  }
}

export default ProductList

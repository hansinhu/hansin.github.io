import React from 'react'
import PropTypes from 'prop-types'
import LazyLoad from 'react-lazyload'
import classNames from 'classnames'
import n from 'numeral'
import _ from 'lodash'
import { withRouter, Link } from 'react-router-dom'
import { utils, LazyImg, trace } from '@/pages/components'
import * as styles from './index.less'

class ProductItem extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    className: PropTypes.string,
    imgClassName: PropTypes.string,
    history: PropTypes.object,
    listPosition: PropTypes.number,
  }

  productClick = () => {
    // 衡量商品点击
    // https://developers.google.com/analytics/devguides/collection/gtagjs/enhanced-ecommerce#measure_product_clicks
    const { product, listPosition = 1 } = this.props
    const { gtag = () => {} } = window

    trace.click({
      mid: '9.1',
      pid: product.id,
      p: listPosition,
      pvid: product.pvid,
      pri: product.listPrice,
      theme: product.actid || '',
    })
    gtag('event', 'select_content', {
      items: [
        {
          id: product.id,
          name: product.name || '',
          brand: `${product.productNo} & ${product.listPrice}`,
          category: product.categoryId,
          list_position: listPosition,
          price: product.listPrice,
        },
      ],
    });
  }

  render () {
    const { className, product, imgClassName, listPosition } = this.props
    const { imageUrl, listPriceLocal, cPlatformPriceLocal, symbol, off } = product
    const showOff = cPlatformPriceLocal && cPlatformPriceLocal > listPriceLocal
    return <div onClick={this.productClick} className={classNames(styles.p_item, className)}>
      <Link target='_blank' rel='noopener noreferrer' to={`/product/${product.id}`}>
        <LazyLoad
          once
          offset={200}
          throttle={300}
          placeholder={<div className={classNames(styles.p_img, styles.place_img, imgClassName)}>KARTINDIAN</div>}
        >
          <div
            className={classNames(styles.p_img, imgClassName)}
          >
            <LazyImg
              onLoad={() => {
                trace.expose({
                  mid: '9.1',
                  pid: product.id,
                  p: listPosition,
                  pvid: product.pvid,
                  pri: product.listPrice,
                  theme: product.actid || '',
                })
              }}
              src={utils.clubImgUrl(imageUrl, '350x350')}
            />
          </div>
        </LazyLoad>
        <div className={styles.p_bottom}>
          <div className={styles.p_price_1}>
            <span>{symbol}{listPriceLocal}</span>
            {
              showOff && off !== 0 ? <span>{`${n(off).format('0%')} off`}</span> : null
            }
          </div>
          <div className={styles.p_price_2}>
            {
              showOff && <span>{symbol}{cPlatformPriceLocal}</span>
            }
          </div>
        </div>
      </Link>
    </div>
  }
}
export default withRouter(ProductItem)

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import LazyLoad from 'react-lazyload'
import styles from './index.less'
import { utils } from '@/pages/components'

const renderGatiDesc = skuCopyFlagList => {
  return <>
  {
    skuCopyFlagList.map((item, index) => {
      if (item === 'notSupportCod') return <div className={styles.gati_desc} key={index}>COD is not available for overweight products. Please pay by online payment.</div>
      if (item === 'notSupportDelivery') return <div className={classNames(styles.gati_desc, styles.red)} key={index}>Your address is out of delivery service for this overweight item.Please delete it or change another address to continue.</div>
      return null
    })
  }
  </>
}

const OrderProduct = (props) => {
  const { imageUrl, productName, priceReal, currency, priceMarking, skuAttr, productQty, skuCopyFlagList } = props.product
  return <div
    onClick={props.onClick}
  >
    <div className={classNames(styles.order_product, {
      [styles.order_p__border]: props.borderBottom,
    })}>
      <div>
        <LazyLoad
          once
          offset={200}
          throttle={300}
          placeholder={<div className={styles.p_img}>club factory</div>}
        >
          <div
            className={styles.p_img}
            style={{
              backgroundImage: 'url("' + utils.clubImgUrl(imageUrl, '350x350') + '")',
            }}
          />
        </LazyLoad>
      </div>
      <div className={styles.p_desc}>
        <div className={styles.p_name}>{productName}</div>
        <div className={styles.p_attr}>{skuAttr}</div>
        <div className={styles.price}>
          <span className={styles.price_1}>{currency} {priceReal} <span className={styles.price_2}>{priceMarking}</span></span>
          <span>x {productQty}</span>
        </div>
      </div>
    </div>
    {
      skuCopyFlagList && renderGatiDesc(skuCopyFlagList)
    }
  </div>
}

OrderProduct.propTypes = {
  product: PropTypes.object,
  borderBottom: PropTypes.bool,
  onClick: PropTypes.func,
}

export default OrderProduct

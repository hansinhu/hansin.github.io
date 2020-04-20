import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import * as styles from './index.less'

const SummaryList = (props) => {
  const { payInfo, payChannel, currency, totalPay } = props

  const priceList = [
    {
      name: 'Subtotal',
      key: 'subTotal',
    },
    {
      name: 'Shipping Fee',
      key: 'shipping',
      emptyShow: true,
    },
    {
      name: 'Coupon Discount',
      key: 'couponTotal',
    },
    {
      name: 'Promotion',
      key: 'promotion',
    },
    {
      name: 'Online Payment Offer',
      key: 'onlinePayTotalDiscount',
    },
    {
      name: 'Balance',
      key: 'balanceTotal',
    },
    {
      name: 'COD Charge',
      key: 'codFee',
      emptyShow: payChannel === 'cod',
    },
  ]

  const showCut = (key, count = 0) => {
    if (['couponTotal', 'promotion', 'balanceTotal', 'onlinePayTotalDiscount'].includes(key) && count > 0) {
      return '-'
    } else {
      return ''
    }
  }

  return <div className={styles.summary_list}>
    {
      priceList.map((item, i) => {
        return (
          payInfo[item.key] || item.emptyShow ? <div key={i} className={styles.summary_item}>
            <span>{item.name}</span>
            <span>
              {showCut(item.key, payInfo[item.key])}&nbsp;
              {payInfo[item.key] ? currency : ''}&nbsp;
              {payInfo[item.key] || 'Free'}
            </span>
          </div> : null
        )
      })
    }
    <div className={classNames(styles.summary_item, styles.pay_total)}>
      <span>Paid Total</span>
      <span className={styles.total_paid_count}>{currency} {totalPay}</span>
    </div>
    <div className={styles.tax}>(Tax Included)</div>
  </div>
}

SummaryList.propTypes = {
  payChannel: PropTypes.string,
  currency: PropTypes.string,
  payInfo: PropTypes.object.isRequired,
  totalPay: PropTypes.number,
}

SummaryList.defaultProps = {
  payInfo: {},
  totalPay: 0,
}

export default SummaryList

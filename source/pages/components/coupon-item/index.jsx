import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import classNames from 'classnames'
import { Radio } from '@/pages/components'
import * as styles from './index.less'

const CouponItem = (props) => {
  const { coupon, showCheckBox, currency, checkedId } = props
  const rule = coupon?.discountRules?.[0]

  // 2019 Mar 21st - 22th 或 2019 Mar 21st - 2020 Apr 22th
  const DaysDoubleDo = (times1, times2, slipStr = ' — ') => {
    let do_1 = dayjs(times1).format('YYYY-MM-DD')
    if (new Date(times1).getFullYear() === new Date(times2).getFullYear()) {
      return do_1 + slipStr + dayjs(times2).format('MM-DD hh:mm')
    } else {
      return do_1 + slipStr + dayjs(times2).format('YYYY-MM-DD')
    }
  }

  const isCheckedId = `${checkedId}` === `${coupon.couponuuid}`

  return <div
    className={classNames(styles.coupon, {
      [styles.coupon_select]: isCheckedId,
      [styles.coupon_disable]: props.disable,
    })}
    onClick={() => {
      if (!props.disable) {
        props.handleCouponClick(coupon)
      }
    }}>
    <div className={styles.conpon_inner}>
      <div className={styles.coupon_info}>
        <div className={styles.info_left}>
          {
            // 满减
            rule?.type === 2
              ? <div className={styles.save_type}>
                <span>
                  <span className={styles.symble_font}>{currency}</span>
                  <span className={styles.count_font}>{rule.offAmount}</span>
                </span>
                <span className={styles.type_font}>SAVE</span>
              </div>
              : null
          }
          {
            // 折扣
            rule?.type === 3
              ? <div className={styles.save_type}>
                <span>
                  <span className={styles.count_font}>{rule.offPercent}</span>
                  <span className={styles.symble_font}>%</span>
                </span>
                <span className={styles.type_font}>OFF</span>
              </div>
              // ? <div className={styles.off_type}>
              //   <span className={styles.count_font}>{rule.offPercent}</span>
              //   <span className={styles.symble_font}>%</span>
              //   <span className={styles.type_font}> OFF</span>
              // </div>
              : null
          }
        </div>
        <div className={styles.info_right}>
          <div className={styles.info_from}>{'Compensate'}</div>
          <div className={styles.info_limit}>
            {
              coupon?.termsLines?.map((term, i) => {
                return <div key={i}>{term}</div>
              })
            }
          </div>
        </div>
      </div>
      <div className={styles.coupon_time}>
        {
          showCheckBox ? <Radio checked={isCheckedId} /> : null
        }
        <span className={classNames({ [styles.time_mar]: showCheckBox })}>Vaild Period: {DaysDoubleDo(coupon.startDateLocal, coupon.expiryDateLocal)}</span>
      </div>
    </div>
  </div>
}


CouponItem.propTypes = {
  coupon: PropTypes.object,
  showCheckBox: PropTypes.bool,
  disable: PropTypes.bool,
  currency: PropTypes.string,
  handleCouponClick: PropTypes.func,
  checkedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

CouponItem.defaultProps = {
  coupon: {},
  showCheckBox: true,
  disable: false,
  handleCouponClick: () => {},
}

export default CouponItem

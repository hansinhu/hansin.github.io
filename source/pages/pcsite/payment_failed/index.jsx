import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import { ERROR_MSG } from '@/constants'
import { utils, Icon, Button } from '@/pages/components'

import * as styles from './index.less'

@observer
class PaymentFailed extends React.Component {
  static propTypes = {
    order_pay: PropTypes.object,
    history: PropTypes.object,
  }

  constructor (props) {
    super(props)
    this.orderName = utils.getQuery().orderName || ''
    this.payFailedStatus = utils.getQuery().state || 'failed'
  }

  getMsg () {
    return ERROR_MSG.payFailed[this.payFailedStatus]
  }

  toOrders = () => {
    window.location.href = '/user?type=order&active=2'
  }

  tryPay = () => {
    // 支付失败页点击try again去旧的支付页
    window.location.href = `/payment?orderName=${this.orderName}`
  }

  render () {
    const isOneOrder = this.orderName.split(',').length === 1
    const paying = this.payFailedStatus === 'pending'

    return <div className={styles.pay_fail}>
      <div className={styles.page_content}>
        <div className={styles.success_icon_warp}>
          <div><Icon className={styles.su_icon} name='guanbi-copy'/></div>
          <h5>Payment Failed</h5>
          <p>{ this.getMsg() }</p>
          <p style={{ marginTop: '22px' }}>You can check your information in your email.</p>
        </div>
        <div className={styles.btns}>
          <Button
            className={styles.orders}
            type='white'
            size='lg'
            onClick={this.toOrders}
          >
            View My Orders
          </Button>
          {
            isOneOrder && !paying ? <Button
              className={styles.try}
              size='lg'
              onClick={this.tryPay}
            >
              Try Again
            </Button> : null
          }
        </div>
      </div>
    </div>
  }
}
export default PaymentFailed

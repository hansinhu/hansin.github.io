/*
 * @file 游客查单 page
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-10-15 15:54:35
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-10-15 15:54:56
 */

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import { Modal, Input, Button } from '@/pages/components'
import * as styles from './index.less'

import guest_order_store from './guest_order_store'

@observer
class FindGuestOrder extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    handleCancel: PropTypes.func,
  }

  static defaultProps = {
    handleCancel: () => {},
  }

  constructor (props) {
    super(props)
    this.guest_order_store = guest_order_store
    this.state = {
      currentPage: 1,
    }
  }

  render () {
    const { visible, handleCancel } = this.props
    const { phoneCode, phoneLen, guestOrderForm, changeFormItem, getPhoneVerifyCode, submitLoading, submitOrderInfo } = this.guest_order_store
    return <Modal
      showCloseIcon
      onCancel={handleCancel}
      visible={visible}
      className={styles.guest_order_modal}
      title={'Find Guest Order'}
    >
      <div className={styles.guest_modal_content}>
        <div>
          <div className={styles.input_label}>Order Number</div>
          <Input
            size='xlg'
            value={guestOrderForm.orderName}
            placeholder='SOXXXXXX'
            onChange={(val) => changeFormItem('guestOrderForm.orderName', val)}
            errorMsg={guestOrderForm.orderMsg}
          />
          <div className={styles.order_name_tips}>Find your order number in the confirmation email</div>
        </div>
        <div>
          <div className={styles.input_label}>Phone Number</div>
          <div>
            <div className={styles.phone_input}>
              <Input size='xlg' value={`+ ${phoneCode}`} disabled className={styles.phone_code} />
              <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
              <Input
                size='xlg'
                maxLength={phoneLen}
                placeholder='Mobile Phone'
                value={guestOrderForm.phone}
                type='number'
                onChange={(val) => changeFormItem('guestOrderForm.phone', val)}
              />
            </div>
            <div className={styles.phone_msg}>{guestOrderForm.phoneMsg}</div>
          </div>
        </div>

        <div>
          <div className={styles.input_label}>Verification Code</div>
          <div className={styles.phone_verify_code}>
            <Input
              size='xlg'
              value={guestOrderForm.verifyCode}
              placeholder='Verification code'
              onChange={(val) => changeFormItem('guestOrderForm.verifyCode', val)}
              maxLength={6}
              errorMsg={guestOrderForm.codeMsg}
              extra={
                <div
                  className={classNames(styles.send_code_btn,
                    { [styles.send_code_disable]: !!guestOrderForm.codeSeconds || guestOrderForm.codeSending }
                  )}
                  onClick={getPhoneVerifyCode}
                >{guestOrderForm.codeSeconds ? `Resend (${guestOrderForm.codeSeconds}s)` : (guestOrderForm.codeSended ? 'Resend' : 'Send')}
                </div>
              }
            />
          </div>
        </div>

        <div className={styles.down_load_tips}>
          Please <a href='/download_app' target='_blank' rel='noopener noreferrer'>download our app</a> for easy return. (Account &gt; Find My order &gt; Apply for Return)
        </div>

        <div>
          <Button
            style={{ width: '100%' }}
            onClick={submitOrderInfo}
            disabled={submitLoading}
            className={styles.login_btn}
          >Find My Order</Button>
        </div>

        <div className={styles.scams}>
          <div className={styles.scams_title}>Beware of Scams:</div>
          <div>{`Don't disclose your OTP to other people. Club Factory will not ask for your OTP in any way.`}</div>
        </div>

      </div>
    </Modal>
  }
}
export default FindGuestOrder

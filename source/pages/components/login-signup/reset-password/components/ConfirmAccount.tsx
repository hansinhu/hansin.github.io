import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { Button, ModalHeader } from '@/pages/components'

import * as styles from './index.less'

export interface ConfirmAccountProps {
  style?: CSSProperties;
  className?: string,
  store: any,
  backToLogin: () => void;
}

@observer
class ConfirmAccount extends React.Component<ConfirmAccountProps, any> {
  store: any;

  render () {
    const {
      account,
      isPhoneNum,
      phoneCode,
      handleConfrimAccount,
      loadingState,
    } = this.props.store
    const phoneAccount = `+${phoneCode} ${account.value}`
    return <div className={classnames(styles.reset_wrap, styles.reset_account)}>
      <div className={styles.reset_main}>
        <div className={styles.reset_title_wrap}>
          <ModalHeader
            onBack={this.props.backToLogin}
            title={isPhoneNum ? 'Confirm Mobile Number' : 'Confirm Email Address'}
          />
          <p className={styles.reset_tips}>
            <span>{`Please confirm if it's your registered ${isPhoneNum ? 'phone number' : 'email address'} `}</span>
            <span style={{ color: '#333333' }}>{isPhoneNum ? phoneAccount : account.value}</span>
          </p>
        </div>
        <div className={styles.reset_btn_wrap}>
          <Button
            size='lg'
            onClick={handleConfrimAccount}
            disabled={loadingState.verifyCode}
            className={classnames(styles.reset_btn, styles.send_btn_1)}
          >
            Send Verification Code
          </Button>
        </div>
      </div>

      <div className={styles.reset_bttom}>
        <div>
          <span>Can’t receive code? </span>
          <a
            className={styles.pc_link_text}
            target='_blank'
            rel='noopener noreferrer'
            href='/document/faq'
          >CF Support &gt;</a>
        </div>
      </div>
    </div>
  }
}

export default ConfirmAccount


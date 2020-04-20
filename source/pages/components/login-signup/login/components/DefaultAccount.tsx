import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { Button, GgAndFbLogin, trace } from '@/pages/components';
import Avatar from './Avatar';

import * as styles from './index.less'

export interface DefaultAccountProps {
  style?: CSSProperties;
  className?: string;
  store: any;
  toSignUp: (accout?: string) => void;
}

@observer
class DefaultAccount extends React.Component<DefaultAccountProps, any> {
  store: any;
  constructor (props: DefaultAccountProps) {
    super(props)
    this.state = {
      focus: false,
    }
  }

  componentDidMount () {
    const { initDefaultAccount } = this.props.store
    initDefaultAccount && initDefaultAccount()
  }

  hanldeDefaultLogin = () => {
    const {
      useDefaultAccount,
      defaultAccount,
      loginByFacebookToken,
      loginByGoogleToken,
    } = this.props.store

    trace.click({ mid: '41.2.2' })

    if (defaultAccount.loginBy === 'facebook') {
      loginByFacebookToken()
    } else if (defaultAccount.loginBy === 'google') {
      loginByGoogleToken()
    } else {
      useDefaultAccount()
    }
  }

  render () {
    const {
      defaultAccount,
      switchAccount,
      initGoogleScript,
      initFacebookScript,
      loginByFacebookToken,
      loginByGoogleToken,
    } = this.props.store

    return <div className={classnames(styles.login_wrap, styles.login_account)}>
      <div className={styles.login_main}>
        <Avatar
          avatarUrl={defaultAccount.avatar}
          account={defaultAccount ? defaultAccount.cryptoAccount : null}
        />
        <div>
          <Button
            size='lg'
            disabled={!defaultAccount.account}
            onClick={this.hanldeDefaultLogin}
            style={{ fontSize: '16px', width: '100%' }}
          >
            Log In
          </Button>
          <Button
            style={{ fontSize: '16px', width: '100%', marginTop: '20px' }}
            size='lg'
            type='white'
            onClick={() => {
              trace.click({ mid: '41.4.2' })
              switchAccount()
            }}
          >
            Switch Account
          </Button>
        </div>
      </div>

      <div className={styles.login_bottom}>
        <div>
          <span>New User? </span>
          <span
            className={styles.pc_link_text}
            onClick={() => {
              this.props.toSignUp()
            }}
          >Sign up></span>
        </div>
        <div className={styles.login_or}>— or —</div>
        <GgAndFbLogin
          initGoogleScript={initGoogleScript}
          initFacebookScript={initFacebookScript}
          loginByFacebookToken={() => {
            trace.click({ mid: '41.1.1' })
            loginByFacebookToken()
          }}
          loginByGoogleToken={() => {
            trace.click({ mid: '41.1.2' })
            loginByGoogleToken()
          }}
        />
      </div>
    </div>
  }
}

export default DefaultAccount


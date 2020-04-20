import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { Button, FbLoginBtn, GgLoginBtn, trace } from '@/pages/components';
import Avatar from './Avatar';

import * as styles from './index.less'


export interface BeforeLogInProps {
  style?: CSSProperties;
  className?: string;
  store: any;
  toSignUp: (accout?: string) => void;
}

@observer
class BeforeLogIn extends React.Component<BeforeLogInProps, any> {

  toSignUp = () => {
    trace.click({ mid: '41.2.1' })
    this.props.toSignUp()
  }

  toLogin = () => {
    const {
      pushStep,
    } = this.props.store
    trace.click({ mid: '41.2.2' })
    pushStep('input-account')
  }

  render () {
    const {
      initGoogleScript,
      initFacebookScript,
      loginByFacebookToken,
      loginByGoogleToken,
    } = this.props.store

    return <div className={classnames(styles.login_wrap, styles.login_account)}>
      <div className={styles.login_main}>
        <Avatar />
        <div>
          {/* <FbLoginBtn
            initFacebookScript={initFacebookScript}
            loginByFacebookToken={() => {
              trace.click({ mid: '41.1.1' })
              loginByFacebookToken()
            }}
            style={{marginBottom: '12px'}}
            btnText='Log in with Facebook'
          /> */}
          <GgLoginBtn
            initGoogleScript={initGoogleScript}
            loginByGoogleToken={() => {
              trace.click({ mid: '41.1.2' })
              loginByGoogleToken()
            }}
            btnText='Log in with Google  '
          />
        </div>
      </div>

      <div className={classnames(styles.login_bottom, styles.login_b_bottom)}>
        <div className={styles.login_or}> — or — </div>
        <br />
        <Button
            size='lg'
            style={{ width: '100%' }}
            onClick={this.toSignUp}
          >
            New User? Sign Up
          </Button>
          <Button
            style={{ fontSize: '16px', marginTop: '20px', width: '100%' }}
            size='lg'
            type='white'
            onClick={this.toLogin}
          >
            Existing User? Log In
          </Button>
      </div>
    </div>
  }
}

export default BeforeLogIn


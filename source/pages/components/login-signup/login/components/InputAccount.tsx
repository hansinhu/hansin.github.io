import React, { CSSProperties } from 'react';
import { observer, inject } from 'mobx-react'
import classnames from 'classnames';

import { Button, GgAndFbLogin, InputWidthEmail, trace } from '@/pages/components'
import { getCountry } from 'pc/tool'

import * as styles from './index.less'

export interface InputAccountProps {
  style?: CSSProperties;
  className?: string;
  store: any;
  common_store: any;
  toSignUp: (accout?: string) => void;
}

@inject('common_store')
@observer
class InputAccount extends React.Component<InputAccountProps, any> {
  placehoder = 'Your Registered Mobile No./ Email'
  inputType = 'text'
  onlyPhone = false
  onlyEmail = false

  constructor (props) {
    super(props)
    const {
      changeAccountType,
    } = props.store
    // 读取配置：是否只允许一种登录方式
    const countryCode = getCountry()
    let phoneLogin = (window?.phoneLoginCountries || '').split(',').includes(countryCode)
    let emailLogin = (window?.emailLoginCountries || '').split(',').includes(countryCode)
    // 如果两个都是false, 则默认都设为手机登录
    if (!phoneLogin && !emailLogin) {
      phoneLogin = true
      emailLogin = false
    }
    this.onlyPhone = phoneLogin && !emailLogin
    this.onlyEmail = !phoneLogin && emailLogin
    if (this.onlyPhone) {
      this.placehoder = 'Your Registered Mobile No.'
      this.inputType = 'number'
      changeAccountType('phone')
    } else if (this.onlyEmail) {
      this.placehoder = 'Your Registered Email Address'
      changeAccountType('email')
    }
  }
  
  componentDidMount () {
    window.addEventListener('keyup', this.handleContinue)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleContinue)
  }

  handleContinue = (e) => {
    const {
      account,
      handleAccountContinue,
    } = this.props.store
    if (account.value && e.keyCode === 13) {
      handleAccountContinue()
    }
  }

  render () {
    const {
      isPhoneNum,
      changeFormVal,
      account,
      phoneCode,
      commonMailList,
      validAccount,
      handleAccountContinue,
      initGoogleScript,
      initFacebookScript,
      loginByFacebookToken,
      loginByGoogleToken,
      loadingState,
    } = this.props.store

    return <div className={classnames(styles.login_wrap, styles.login_account)}>
      <div className={styles.login_main}>
        <div className={styles.login_title_wrap}>
          <h3 className={styles.login_title}>Welcome</h3>
          <p className={styles.login_tips}>
            {
              this.onlyPhone ? `Please enter your registered Phone No.` : ''
            }
            {
              this.onlyEmail ? `Please enter your registered Email ID` : ''
            }
            {
              !this.onlyPhone && !this.onlyEmail ? 'Please enter your registered Phone No. / Email ID' : ''
            }
          </p>
        </div>
        <div>
          <InputWidthEmail
            isPhoneNum={isPhoneNum && !this.onlyEmail}
            changeFormVal={changeFormVal}
            account={account}
            phoneCode={phoneCode}
            commonMailList={this.onlyPhone ? [] : commonMailList}
            validAccount={validAccount}
            placehodler={this.placehoder}
            type={this.inputType}
          />
          <Button
            size='lg'
            style={{ marginTop: '34px', width: '100%', fontSize: '16px' }}
            disabled={!account.value}
            loading={loadingState.checkAccount}
            onClick={handleAccountContinue}
          >
            Continue
          </Button>
        </div>
      </div>

      <div className={styles.login_bottom}>
        <div>
          <span>New User? </span>
          <span className={styles.pc_link_text} onClick={() => { this.props.toSignUp() }}>Sign up></span>
        </div>
        <div className={styles.login_or}>- or -</div>
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

export default InputAccount


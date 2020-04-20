import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'
import classnames from 'classnames';

import { getCountry } from 'pc/tool'
import { Icon, Button, InputItem, GgAndFbLogin, InputWidthEmail, trace } from '@/pages/components'
import * as styles from './index.less'

export interface InputAccountProps {
  style?: CSSProperties;
  className?: string;
  store: any;
  login_store: any;
  toLogin: (account?: string) => void;
}

@observer
class InputAccount extends React.Component<InputAccountProps, any> {
  onlyPhone = false
  onlyEmail = false
  constructor (props: InputAccountProps) {
    super(props)
    this.state = {
      focus: false,
    }
    const countryCode = getCountry()
    let phoneSignup = (window?.phoneSignupCountries || '').split(',').includes(countryCode)
    let emailSignup = (window?.emailSignupCountries || '').split(',').includes(countryCode)
    // 如果两个都是false, 则默认都设为手机注册
    if (!phoneSignup && !emailSignup) {
      phoneSignup = true
      emailSignup = false
    }
    this.onlyPhone = phoneSignup && !emailSignup
    this.onlyEmail = !phoneSignup && emailSignup
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleContinue)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleContinue)
  }

  handleContinue = (e) => {
    const {
      signAccountType,
      account,
      handleAccountContinue,
      termsChecked,
      phoneLength,
      loadingState,
    } = this.props.store
    const btnContinue = signAccountType === 'phone' ? account.value.length === phoneLength : !!account.value
    if (!loadingState.checkAccount && btnContinue && termsChecked && e.keyCode === 13) {
      handleAccountContinue && handleAccountContinue()
    }
  }

  render () {
    const {
      signAccountType,
      toggleSignupType,
      changeFormVal,
      account,
      phoneCode,
      commonMailList,
      validAccount,
      handleAccountContinue,
      termsChecked,
      toggleTermsChecked,
      phoneLength,
      loadingState,
    } = this.props.store

    const {
      initGoogleScript,
      initFacebookScript,
      loginByFacebookToken,
      loginByGoogleToken,
    } = this.props.login_store
    
    const { focus } = this.state

    const btnContinue = signAccountType === 'phone' ? account.value.length === phoneLength : !!account.value
    return <div className={classnames(styles.sign_wrap, styles.sign_account)}>
      <div className={styles.sign_main}>
        <div className={styles.sign_title_wrap}>
          <h3 className={styles.sign_title}>Create Your Account</h3>
          <p className={styles.sign_tips}>Please enter your {signAccountType === 'phone' ? `Mobile Number` : 'Email Address'} to register</p>
        </div>
        <div>
        {
          signAccountType === 'phone'
            ? <InputItem
                placeholder='Your Phone Number'
                className={classnames(styles.sign_input, {
                  [styles.sign_input_active]: focus && !account.errorMsg,
                })}
                onChange={(val: string) => { 
                  changeFormVal('account', val.replace(/ /g, ''))
                }}
                onFocus={() => { this.setState({ focus: true }) }}
                onBlur={() => {
                  setTimeout(() => {
                    validAccount()
                    this.setState({ focus: false })
                  }, 100)
                }}
                label={<span className={styles.pc_phone_lable}>+{phoneCode}</span>}
                value={account.value}
                maxLength={phoneLength}
                errorMsg={account.errorMsg}
              />
            : <InputWidthEmail
                isPhoneNum={false}
                changeFormVal={changeFormVal}
                account={account}
                phoneCode={phoneCode}
                commonMailList={commonMailList}
                validAccount={validAccount}
                placehodler='Your Email Address'
              />
          }
          <div className={styles.sign_toggle_account}>
            {
              /* 只有一种注册方式是不可切换 */
              this.onlyPhone || this.onlyEmail
                ? null
                : <span className={styles.pc_link_text} onClick={() => { toggleSignupType() }}>
                Use {signAccountType === 'phone' ? `Email` : 'Phone Number'} to Register
                </span>
            }
          </div>
          <Button
            className={styles.sign_btn}
            size='lg'
            style={{ width: '100%' }}
            disabled={!btnContinue || !termsChecked}
            loading={loadingState.checkAccount}
            onClick={handleAccountContinue}
          >
            Continue
          </Button>
        </div>
        <div className={styles.sign_terms}>
          <span
            onClick={() => { toggleTermsChecked(!termsChecked) }}
          >
            <Icon
              className={classnames(styles.sign_check_icon, { [styles.is_checked]: termsChecked })}
              name={termsChecked ? 'is_checked' : 'is_uncheck'} />
          </span>
          <span
            className={styles.sign_terms_text}
          >Subscribe our DM to get more sale information By clicking continue, you agree to <a target='_blank' rel='noopener noreferrer' href='/document/terms-conditions' className={styles.pc_link_text}>our terms></a></span>
        </div>
      </div>

      <div className={styles.sign_bottom}>
        <div>
          <span>Existing User? </span>
          <span className={styles.pc_link_text} onClick={() => { this.props.toLogin() }}>Log In></span>
        </div>
        <div className={styles.sign_or}>— or —</div>
        
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


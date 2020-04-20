import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { Icon } from '@/pages/components'
import { Button, InputItem, ModalHeader} from '@/pages/components';
import Avatar from './Avatar'
import * as styles from './index.less'

export interface InputPasswordProps {
  style?: CSSProperties;
  className?: string;
  store: any;
}

@observer
class InputPassword extends React.Component<InputPasswordProps> {

  componentDidMount () {
    window.addEventListener('keyup', this.handleContinue)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleContinue)
    this.props.store.changeFormVal('password', '', 'errorMsg')
    this.props.store.changeFormVal('captchaInfo', '', 'key')
    this.props.store.changeFormVal('captchaInfo', '', 'value')
    this.props.store.changeFormVal('captchaInfo', '', 'img')
    this.props.store.changeFormVal('captchaInfo', '', 'errorMsg')
  }

  handleContinue = (e) => {
    const {
      loginByPwd,
      loginByPwdBtnEnable,
      loadingState,
    } = this.props.store
    if (!loadingState.login && loginByPwdBtnEnable && e.keyCode === 13) {
      loginByPwd()
    }
  }

  render () {
    const {
      changeFormVal,
      account,
      password,
      passwordHidden,
      togglePassword,
      replaceStep,
      toResetPassword,
      loginByPwd,
      captchaInfo,
      getCaptcha,
      isPhoneNum,
      phoneCode,
      popStep,
      loginByPwdBtnEnable,
      loadingState,
    } = this.props.store

    const showAccount = isPhoneNum ? `+${phoneCode} ${account.value}` : account.value
    return <div className={classnames(styles.login_wrap, styles.login_emailpwd)}>
      <div className={styles.login_main}>
        <ModalHeader onBack={popStep} />
        <Avatar
          account={showAccount}
          avatarUrl={account.avatar}
        />
        <InputItem
          type={passwordHidden ? 'password' : 'text'}
          placeholder='Your Password'
          className={styles.pc_login_input}
          extra={<div className={styles.pc_login_inputextra}>
            <span className={styles.login_hidepwd} onClick={togglePassword}>
              {passwordHidden ? <Icon name='yincang' style={{ fontSize: '18px' }} /> : <Icon name='TIM-' style={{ fontSize: '18px' }} />}
            </span>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                toResetPassword()
              }}
            >Forgot?</span>
          </div>}
          onChange={(val: string) => { changeFormVal('password', val) }}
          value={password.value}
          errorMsg={password.errorMsg}
        />
        {
          captchaInfo.key
            ? <InputItem
              placeholder='Type Characters'
              className={styles.pc_login_input}
              extra={<div onClick={getCaptcha} className={classnames(styles.pc_login_inputextra, styles.login_captextra)}>
                <div>
                  <img className={styles.login_code_img} src={captchaInfo.img} />
                </div>
                <div><Icon name='shuaxin1' style={{ fontSize: '18px' }} /></div>
              </div>}
              onChange={(val: string) => { changeFormVal('captchaInfo', val) }}
              value={captchaInfo.value}
              maxLength={4}
              errorMsg={captchaInfo.errorMsg}
            />
            : null
        }
        {
          isPhoneNum
            ? <div className={styles.login_toveri}>
              <span
                className={styles.pc_link_text}
                onClick={() => { replaceStep('verify-code') }}
              >Use verification code</span>
            </div>
            : null
        }
      </div>

      <div className={styles.login_btn_wrap}>
        <Button
          size='lg'
          className={styles.login_btn}
          disabled={!loginByPwdBtnEnable || !password.value}
          loading={loadingState.login}
          onClick={() => {
            loginByPwd()
          }}
        >Continue</Button>
      </div>
    </div>
  }
}

export default InputPassword

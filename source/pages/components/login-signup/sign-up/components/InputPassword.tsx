import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { Icon, Button, InputItem, ModalHeader } from '@/pages/components';

import * as styles from './index.less'

export interface InputPasswordProps {
  style?: CSSProperties;
  className?: string;
  store: any;
  captVisible?: boolean;
}

@observer
class InputPassword extends React.Component<InputPasswordProps> {

  componentDidMount () {
    window.addEventListener('keyup', this.handleContinue)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleContinue)
  }

  handleContinue = (e) => {
    if (this.props.captVisible) return
    const {
      password,
      submitPwd,
    } = this.props.store
    if (password.value && e.keyCode === 13) {
      submitPwd && submitPwd()
    }
  }

  render () {
    const {
      changeFormVal,
      password,
      passwordHidden,
      togglePassword,
      submitPwd,
      popStep,
    } = this.props.store

    return <div className={classnames(styles.sign_wrap, styles.sign_emailpwd)}>
      <div className={styles.sign_main}>
        <div className={styles.sign_title_wrap}>
          <ModalHeader
            onBack={popStep}
            title='Set Your Password'
          />
          <p className={styles.sign_tips}>
            <span>Your password must be 6-20 characters, include a number, an uppercase letter and a lowercase letter.</span>
          </p>
        </div>
        <InputItem
          type={passwordHidden ? 'password' : 'text'}
          placeholder='Your Password'
          className={styles.sign_input}
          extra={<div className={styles.sign_inputextra}>
            <span className={styles.sign_hidepwd} onClick={togglePassword}>
              {passwordHidden ? <Icon name='yincang' style={{ fontSize: '18px' }} /> : <Icon name='TIM-' style={{ fontSize: '18px' }} />}
            </span>
          </div>}
          onChange={(val: string) => { changeFormVal('password', val) }}
          value={password.value}
          errorMsg={password.errorMsg}
        />
        
      </div>

      <div className={styles.sign_btn_wrap}>
        <Button
          className={styles.sign_btn}
          size='lg'
          disabled={!password.value}
          onClick={submitPwd}
        >Continue</Button>
      </div>
    </div>
  }
}

export default InputPassword

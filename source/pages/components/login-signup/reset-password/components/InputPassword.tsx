import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'

import { Button, InputItem, ModalHeader, Icon } from '@/pages/components';
import * as styles from './index.less'

export interface InputPasswordProps {
  style?: CSSProperties;
  className?: string;
  store: any;
}

@observer
class InputPassword extends React.Component<InputPasswordProps> {

  static defaultProps = {
    type: 'primary', // white light
    size: 'middle', // large small
  }

  store: any;

  componentDidMount () {
    window.addEventListener('keyup', this.handleContinue)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleContinue)
  }

  handleContinue = (e) => {
    const {
      password,
      submitPwd,
      loadingState,
    } = this.props.store
    if (password.value && !loadingState.resetPwd && e.keyCode === 13) {
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
      loadingState,
    } = this.props.store

    return <div className={styles.reset_wrap}>
      <div className={styles.reset_main}>
        <div className={styles.reset_title_wrap}>
          <ModalHeader
            onBack={popStep}
            title='Set Your Password'
          />
          <p className={styles.reset_tips}>
            <span>Your password must be 6-20 characters, include a number, an uppercase letter and a lowercase letter.</span>
          </p>
        </div>
        <InputItem
          type={passwordHidden ? 'password' : 'text'}
          placeholder='Your Password'
          className={styles.reset_input}
          extra={<div className={styles.reset_inputextra}>
            <span className={styles.reset_hidepwd} onClick={togglePassword}>
              {passwordHidden ? <Icon name='yincang' style={{ fontSize: '18px' }} /> : <Icon name='TIM-' style={{ fontSize: '18px' }} />}
            </span>
          </div>}
          onChange={(val: string) => { changeFormVal('password', val) }}
          value={password.value}
          errorMsg={password.errorMsg}
        />
      </div>

      <div className={styles.reset_btn_wrap}>
        <Button
          className={styles.reset_btn}
          size='lg'
          disabled={!password.value}
          loading={loadingState.resetPwd}
          onClick={submitPwd}
        >Continue</Button>
      </div>
    </div>
  }
}

export default InputPassword

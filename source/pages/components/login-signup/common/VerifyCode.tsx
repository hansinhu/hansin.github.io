import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { InputVerifyCode, Button, VoiceCodeTips, ModalHeader } from '@/pages/components'

import * as styles from './VerifyCode.less'

export interface VerifyCodeProps {
  style?: CSSProperties;
  className?: string;
  store: any;
  btnLoading?: boolean;
  handleContinue: () => void;
  usePassword: () => void;
  captVisible?: boolean;
}

@observer
class VerifyCode extends React.Component<VerifyCodeProps> {
  inputEl: any;

  componentDidMount () {
    const { verifyCodeInfo, getVerifyCode } = this.props.store
    if (!verifyCodeInfo.sending && !verifyCodeInfo.timer) {
      getVerifyCode()
    }
    window.addEventListener('keyup', this.handleContinue)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleContinue)
    const { changeFormVal } = this.props.store
    changeFormVal('verifyCode', '')
    changeFormVal('verifyCode', '', 'erroMsg')
  }

  handleContinue = (e) => {
    // 弹窗图文验证，并没有销毁组件，captVisible控制
    if (this.props.captVisible) return
    const { handleContinue, btnLoading } = this.props
    const {
      verifyCode,
    } = this.props.store
    if (!btnLoading && verifyCode?.value.length === 6 && e.keyCode === 13) {
      handleContinue && handleContinue()
    }
  }

  render () {
    const { handleContinue, btnLoading } = this.props
    const {
      changeFormVal,
      account,
      verifyCode,
      phoneCode,
      verifyCodeInfo,
      isPhoneNum,
      showVoiceBtn,
      popStep,
      getVerifyCode,
      storeType,
    } = this.props.store
    const showAccount = isPhoneNum ? `+${phoneCode} ${account.value}` : ` ${account.value}`
    const isVoiceTimer = verifyCodeInfo.isVoiceCode && (verifyCodeInfo.sending || verifyCodeInfo.seconds)
    const isCodeTimer = !verifyCodeInfo.isVoiceCode && (verifyCodeInfo.sending || verifyCodeInfo.seconds)

    return <div className={classnames(styles.sign_wrap, styles.sign_emailpwd)}>
      <div className={styles.sign_main}>
        <ModalHeader onBack={popStep} title={isPhoneNum ? 'Verify Mobile Number' : 'Verify Email Address'} />
        <p className={styles.sign_tips}>
          A text with a verification code has been sent to 
          <span style={{ color: '#333333' }}>{` ${showAccount} `}</span>
          {
            verifyCodeInfo.sending && !verifyCodeInfo.isVoiceCode ? <span style={{ color: '#cccccc' }}>Sending...</span> : null
          }
          {
            verifyCodeInfo.seconds && !verifyCodeInfo.isVoiceCode ? <span style={{ color: '#cccccc' }}>Resend({verifyCodeInfo.seconds}s)</span> : null
          }
          {
            isVoiceTimer ? <span style={{ color: '#cccccc' }}>Resend</span> : null
          }
          {
            !verifyCodeInfo.sending && !verifyCodeInfo.seconds ? <span onClick={getVerifyCode} style={{ color: '#1890FF', cursor: 'pointer' }}>Resend</span> : null
          }
        </p>
        <div className={styles.sign_verify}>
          <InputVerifyCode
            customKeyBoard
            ref={(el: any) => { this.inputEl = el }}
            onChange={(val: string) => {
              if (val && val.length === 6 && this.inputEl) {
                this.inputEl.handleBlur()
              }
              changeFormVal('verifyCode', val)
            }}
            value={verifyCode.value}
            errorMsg={verifyCode.errorMsg}
            maxLength={6}
          />
        </div>
        <div className={styles.sign_voice_code}>
          {
            showVoiceBtn
              ? (<span>Can't receive the code? 
                {
                  verifyCodeInfo.sending && verifyCodeInfo.isVoiceCode ? <span style={{ color: '#cccccc' }}> Sending...</span> : null
                }
                {
                  verifyCodeInfo.seconds && verifyCodeInfo.isVoiceCode ? <span style={{ color: '#cccccc' }}> Get voice code ({verifyCodeInfo.seconds}s)</span> : null
                }
                {
                  isCodeTimer ? <span style={{ color: '#cccccc' }}> Get voice code</span> : null
                }
                {
                  !verifyCodeInfo.sending && !verifyCodeInfo.seconds ? <VoiceCodeTips onClick={() => { getVerifyCode({ voice: true }) }} /> : null
                }
              </span>)
              : null
          }
        </div>
        {
          storeType === 'login' ? <div className={styles.login_topwd}>
            <span
              className={styles.m_link_text}
              onClick={this.props.usePassword}
            >Use password</span>
          </div> : null
        }
      </div>

      <div className={styles.sign_btn_wrap}>
        <Button
          className={styles.sign_btn}
          size='lg'
          disabled={
            !verifyCode.value ||
            verifyCode.value.length < 6 ||
            verifyCodeInfo.sending
          }
          loading={btnLoading}
          onClick={() => { handleContinue && handleContinue() }}
        >Continue</Button>
      </div>
    </div>
  }
}

export default VerifyCode

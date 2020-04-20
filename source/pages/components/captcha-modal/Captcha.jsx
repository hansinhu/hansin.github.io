import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { CaptchaStore } from 'front-components';
import Axios from '@/setup/axios'
import {
  Modal,
  Message,
  InputItem,
  Button,
  Icon,
} from '@/pages/components'

import * as styles from './Captcha.less'

@observer
class Captcha extends React.Component {
  static propTypes = {
    bizType: PropTypes.number,
    bizKey: PropTypes.string,
    onVerifySuccess: PropTypes.func,
    lang: PropTypes.object,
  }
  constructor (props) {
    super(props)
    const { bizType = '', bizKey = '', onVerifySuccess } = props

    this.captcha_store = new CaptchaStore({
      Axios: Axios,
      proxyPath: '/gw',
      bizType: bizType ? Number(bizType) : 0,
      bizKey: bizKey || '',
      onToastMsg: (msg) => {
        Message.error(msg)
      },
      onModalConfirm: Modal.Confirm,
      onVerifySuccess: onVerifySuccess,
    })
  }

  componentDidMount () {
    this.captcha_store.getCaptcha()
    window.addEventListener('keyup', this.handleContinue)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleContinue)
  }

  handleContinue = (e) => {
    const { captchaInfo, loadingState, submitCaptcha } = this.captcha_store
    if (!loadingState.submitCaptcha && captchaInfo.value && e.keyCode === 13) {
      submitCaptcha && submitCaptcha()
    }
  }

  render () {
    const { getCaptcha, captchaInfo, changeFormVal, loadingState, submitCaptcha } = this.captcha_store

    return <div className={styles.captcha_wrap}>
      <div style={{ color: '#666' }}>We need verify that you are not robot.</div>
      <div className={styles.capt_input_box}>
        <InputItem
          placeholder='Type Characters'
          className={styles.capt_input}
          extra={<div onClick={getCaptcha} className={styles.capt_inputextra}>
            <div className={styles.code_img_con}>
              {
                captchaInfo.img ? <img className={styles.code_img} src={captchaInfo.img} /> : null
              }
            </div>
            <div><Icon name='shuaxin1' style={{ fontSize: '18px' }} /></div>
          </div>}
          onChange={(val) => { changeFormVal('captchaInfo', val) }}
          value={captchaInfo.value}
          maxLength={4}
          errorMsg={captchaInfo.errorMsg}
        />
      </div>
      <Button
        size='lg'
        disabled={!captchaInfo.value}
        loading={loadingState.submitCaptcha}
        onClick={submitCaptcha}
        style={{ width: '100%', marginTop: '180px' }}>Continue</Button>
    </div>
  }
}

export default Captcha

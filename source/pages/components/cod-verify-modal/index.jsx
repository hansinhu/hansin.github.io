import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import { cod_verify_store } from 'pc/store'
import { COUNTRY_MAP } from '@/constants'
import {
  Button,
  Modal,
  InputVerifyCode,
  Message,
  VoiceCodeTips,
  Icon,
} from '@/pages/components'
import {
  getCountry,
} from 'pc/tool'

import CountStore from './count_store'
import ModalStore from './cod_modal_store'

import * as styles from './index.less'

@observer
class CodVerifyModal extends React.Component {
  static propTypes = {
    closeDrawerCallback: PropTypes.func,
    phone: PropTypes.string,
    areaCode: PropTypes.string,
    orderNameList: PropTypes.array,
    code_length: PropTypes.number,
    onVerifySuccess: PropTypes.func,
  }

  static defaultProps = {
    closeDrawerCallback: () => {},
    phone: '',
    areaCode: COUNTRY_MAP[getCountry()].phonePrefix + '',
    orderNameList: [],
    code_length: 6,
    onVerifySuccess: () => {},
  }

  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      btnLoading: false,
    }
    this.counter = new CountStore(ModalStore.setFirstTimeover)
  }

  closeModal = () => {
    ModalStore.toggleModal(false)
  }

  inputChange = (value) => {
    this.setState({
      inputValue: value,
    })
  }

  onBlur = () => {
    if (ModalStore.errorInfo.message || ModalStore.errorInfo.className) {
      this.clearInput()
    }
  }

  onClickContinue = () => {
    const { phone, areaCode, code_length, onVerifySuccess, orderNameList } = this.props
    const { inputValue } = this.state
    if (inputValue.length === code_length) {
      this.setState({
        btnLoading: true,
      })
      let postData = {
        phone: phone,
        phoneCode: areaCode,
        verifyCode: inputValue,
      }
      if (orderNameList?.length > 0) {
        postData['orderNameList'] = orderNameList
      }
      if (![1, 2, 3].includes(cod_verify_store.verifyType)) {
        postData['disasterRecoveryCode'] = cod_verify_store.verifyType
      }
      cod_verify_store.validateCode(postData).then(msg => {
        if (msg) {
          ModalStore.setError(msg, 'verifyCodeError')
        } else {
          onVerifySuccess()
        }
      }).catch(err => {
        console.log(err)
        Message.error('Please try again.')
      }).finally(() => {
        this.setState({
          btnLoading: false,
        })
      })
    }
  }

  clearInput = () => {
    ModalStore.setError('', '')
    this.setState({
      inputValue: '',
    })
  }

  sendVerifyCode = (type) => {
    const { sendVerifyCode } = cod_verify_store
    const { phone, areaCode } = this.props
    sendVerifyCode(phone, areaCode, type).then(msg => {
      if (msg) {
        Message.error(msg)
      }
    }).catch(err => {
      console.debug(err)
      Message.error('Send verify code failed.')
    }).finally(() => {
      this.counter.reset(30)
    })
  }

  render () {
    const { phone, areaCode, code_length } = this.props
    const { visible, firstOverTime, errorInfo } = ModalStore
    const { sendType } = cod_verify_store
    const countDown = Math.floor(this.counter.remaining)

    this.phoneDisplay = phone.replace(/(\d{3})\d*(\d{3})/, '$1' + '*'.repeat(Math.max(phone.length - 6, 2)) + '$2')
    return (
      <Modal
        visible={visible}
        className={styles.modal}
        showCloseIcon={true}
        onCancel={this.closeModal}
        maskClickClose={false}
        showCallBack={() => {
          this.clearInput()
          if (countDown === 0) {
            this.sendVerifyCode(1)
          }
        }}
      >
        <div className={styles.title}>Verify Your Identity</div>
        <div className={styles.notice}>
          <Icon name='Aboutus' />
          In order to speed up order processing, we need to confirm your phone number.
        </div>
        <p>A text with a verification code has been sent to</p>
        <p className={styles.phone}>
          +{areaCode} {this.phoneDisplay}
          {(firstOverTime || countDown > 0) && <button
            disabled={countDown > 0}
            onClick={() => {
              this.sendVerifyCode(1)
            }}
          >
            Resend the code{(countDown > 0 && sendType === 1) && <span>({countDown}s)</span>}
          </button>}
        </p>
        <InputVerifyCode
          customKeyBoard
          ref={(el) => { this.inputRef = el }}
          onChange={this.inputChange}
          maxLength={code_length}
          className={classnames(styles.input, styles[errorInfo.className])}
          errorMsg={errorInfo.message}
          onBlur={this.onBlur}
          value={this.state.inputValue}
          onKeyUp={(val) => {
            if (val.keyCode === 13 && this.state.inputValue.length === code_length) {
              this.onClickContinue()
            }
          }}
        />
        {firstOverTime && <p className={styles.voiceCode}>
          Unable to receive the code?
          { countDown > 0
            ? <span className={styles.resend}> Send voice code{(countDown > 0 && sendType === 2) && <span>({countDown}s)</span>}</span>
            : <VoiceCodeTips name='Send voice code' onClick={() => { this.sendVerifyCode(2) }} />
          }
        </p>}
        <Button
          className={styles.button}
          size='lg'
          disabled={this.state.inputValue.length !== code_length}
          loading={this.state.btnLoading}
          onClick={this.onClickContinue}
        >Continue</Button>
      </Modal>
    )
  }
}

export default CodVerifyModal

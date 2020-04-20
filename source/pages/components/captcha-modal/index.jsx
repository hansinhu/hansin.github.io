import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import { CaptchaStore } from 'front-components';
import Axios from '@/setup/axios'
import {
  Modal,
  ModalHeader,
  Message,
} from '@/pages/components'

import Captcha from './Captcha'

import * as styles from './index.less'

@observer
class CaptchaModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    showCloseIcon: PropTypes.bool,
    maskClickClose: PropTypes.bool,
    bizType: PropTypes.number.isRequired,
    bizKey: PropTypes.string.isRequired,
    onVerifySuccess: PropTypes.func.isRequired,
    handleCancel: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    handleCancel: () => {},
    onVerifySuccess: () => {},
    visible: false,
    showCloseIcon: true,
    maskClickClose: false,
  }

  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
    }

    this.captcha_store = new CaptchaStore({
      Axios: Axios,
      proxyPath: '/gw',
      bizType: props.bizType ? Number(props.bizType) : 0,
      bizKey: props.bizKey || '',
      onToastMsg: (msg) => {
        Message.error(msg)
      },
      onModalConfirm: Modal.Confirm,
      onVerifySuccess: props.onVerifySuccess,
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.visible !== this.state.visible) {
      this.setState({
        visible: nextProps.visible,
      })
    }
    if (nextProps.visible === false) {
      this.setState({
        modalContentType: 'login',
      })
    }
  }

  onModalCancel = () => {
    this.setState({
      visible: false,
    }, this.props.handleCancel)
  }

  changeContentType = (page, account) => {
    this.setState({
      modalContentType: page,
      account,
    })
  }

  render () {
    const { visible } = this.state
    const { className, maskClickClose, showCloseIcon, bizKey, bizType, onVerifySuccess } = this.props
    return <Modal
      visible={visible}
      onCancel={this.onModalCancel}
      showCloseIcon={showCloseIcon}
      maskClickClose={maskClickClose}
      className={classnames(styles.captcha_modal, className)}
    >
      <div className={styles.modal_wrap}>
        <ModalHeader
          onBack={this.onModalCancel}
          title='Please Type Characters'
        />
        <Captcha store={this.captcha_store} bizKey={bizKey} bizType={bizType} onVerifySuccess={onVerifySuccess} />
      </div>
    </Modal>
  }
}

export default CaptchaModal

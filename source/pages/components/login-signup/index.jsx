import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import {
  Modal,
} from '@/pages/components'

import * as styles from './index.less'
import Login from './login/index'
import Signup from './sign-up/index'
import ResetPassword from './reset-password'
import Security from './security'

@observer
class LoginSignupModal extends React.Component {
  static propTypes = {
    handleCancel: PropTypes.func,
    visible: PropTypes.bool,
    showContentType: PropTypes.string,
    login_redirect: PropTypes.string,
    className: PropTypes.string,
    showCloseIcon: PropTypes.bool,
    maskClickClose: PropTypes.bool,
    loginFullBg: PropTypes.bool,
  }

  static defaultProps = {
    handleCancel: () => {},
    visible: false,
    showCloseIcon: true,
    maskClickClose: true,
    loginFullBg: false,
    showContentType: 'login', // login signup resetpwd
  }

  constructor (props) {
    super(props)
    this.state = {
      visible: props.visible,
      modalContentType: props.showContentType,
      input_account: false,
    }
  }

  componentWillUnmount () {
    this.setState({
      input_account: false,
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.showContentType !== this.state.modalContentType) {
      this.setState({
        modalContentType: nextProps.showContentType,
      })
    }
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
      input_account: false,
    }, this.props.handleCancel)
  }

  changeContentType = (page, account) => {
    this.setState({
      modalContentType: page,
      account,
    })
    if (page === 'login') {
      this.setState({
        input_account: true,
      })
    }
  }

  render () {
    const { modalContentType, account, visible, input_account } = this.state
    const { login_redirect, className, maskClickClose, showCloseIcon, loginFullBg } = this.props
    const queryCls = 'loginSignUpModal' // 用来做querySelector操作
    return <Modal
      visible={visible}
      onCancel={this.onModalCancel}
      showCloseIcon={showCloseIcon}
      maskClickClose={maskClickClose}
      className={classnames(styles.login_modal, queryCls, className, { [styles.login_full_bg]: loginFullBg })}
    >
      <div>
        {
          loginFullBg ? <div className={styles.login_logo}><div className={styles.logo_img}></div></div> : null
        }
        {
          modalContentType === 'login' ? <Login
            changeContentType={this.changeContentType}
            login_redirect={login_redirect}
            defaultAccount={account}
            input_account={input_account}
          /> : null
        }
        {
          modalContentType === 'signup' ? <Signup
            changeContentType={this.changeContentType}
            login_redirect={login_redirect}
            defaultAccount={account}
          /> : null
        }
        {
          modalContentType === 'resetpwd' ? <ResetPassword
            changeContentType={this.changeContentType}
            login_redirect={login_redirect}
            account={account}
          /> : null
        }
        {
          modalContentType === 'security'
            ? <Security
              login_redirect={login_redirect}
              onBack={() => { this.changeContentType('login') }}
              account={account}
            />
            : null
        }
      </div>
    </Modal>
  }
}

export { default as FbLoginBtn } from './common/FbLoginBtn'
export { default as GgLoginBtn } from './common/GgLoginBtn'
export { default as GgAndFbLogin } from './common/GgAndFbLogin'
export { default as InputWidthEmail } from './common/InputWidthEmail'

export default LoginSignupModal

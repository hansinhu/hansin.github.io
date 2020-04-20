import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { ResetPasswordStore } from 'front-components'

import Axios from '@/setup/axios'
import { logInCallBack, getCountry } from 'pc/tool'

import { Message, Modal, utils } from '@/pages/components'
import VerifyCode from '../common/VerifyCode'
import ConfirmAccount from './components/ConfirmAccount'
import InputPassword from './components/InputPassword'

import * as styles from './index.less'

@observer
class ResetPasswordPage extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    account: PropTypes.string,
    login_redirect: PropTypes.string,
    changeContentType: PropTypes.func,
  }

  constructor (props) {
    super(props)
    const countryCode = getCountry()

    this.resetStore = new ResetPasswordStore({
      Axios: Axios,
      proxyPath: '/gw',
      clubApiProxyPath: '',
      autoSubmitVerifyCode: false,
      countryCode: countryCode,
      storeType: 'resetpassword',
      onToastMsg: (msg) => {
        Message.error(msg)
      },
      onLogined: this.logined,
      onModalConfirm: Modal.Confirm,
      accountInfo: {
        account: decodeURIComponent(props.account),
      },
    })
  }

  logined = (userInfo) => {
    Message.success('Log in successfully')
    const { redirect } = utils.getQuery()
    logInCallBack(userInfo, redirect || this.props.login_redirect)
  }

  navBack = () => {
    const { stepList, popStep } = this.resetStore
    if (stepList.length > 1) {
      popStep()
    } else {
      window.history.go(-1)
    }
  }

  backToLogin = () => {
    this.props.changeContentType('login', this.props.account)
  }

  getStepContent = () => {
    const { currentStep, postVerifyCode, loadingState } = this.resetStore
    switch (currentStep) {
      case 'confirm-account':
        return <ConfirmAccount
          store={this.resetStore}
          backToLogin={this.backToLogin}
        />
      case 'verify-code':
        return <VerifyCode
          store={this.resetStore}
          handleContinue={postVerifyCode}
          btnLoading={loadingState.resetCheck}
        />
      case 'input-password':
        return <InputPassword store={this.resetStore} />
      default:
        return <ConfirmAccount
          store={this.resetStore}
          backToLogin={this.backToLogin}
        />
    }
  }

  render () {
    return <div>
      {/* <NavHeader title='Forgot Password' customBack={this.navBack} /> */}
      <div className={styles.msite_sign}>
        {
          this.getStepContent()
        }
      </div>
    </div>
  }
}
export default ResetPasswordPage

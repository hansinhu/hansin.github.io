import React from 'react'
import PropTypes from 'prop-types'
import { LoginStore } from 'front-components'
import { observer, inject } from 'mobx-react'

import { logInCallBack, getCountry } from 'pc/tool'

import { Message, Modal, trace, utils } from '@/pages/components'
import Axios from '@/setup/axios'

import VerifyCode from '../common/VerifyCode'
import BeforeLogIn from './components/BeforeLogIn'
import DefaultAccount from './components/DefaultAccount'
import InputAccount from './components/InputAccount'
import InputPassword from './components/InputPassword'

import * as styles from './index.less'

@observer
class LoginPage extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    changeContentType: PropTypes.func,
    defaultAccount: PropTypes.string,
    login_redirect: PropTypes.string,
    input_account: PropTypes.bool,
  }
  constructor (props) {
    super(props)
    this.state = {
      currentPage: 1,
    }

    const users = JSON.parse(localStorage.getItem('users_history') || '[]')
    const countryCode = getCountry()

    this.loginStore = new LoginStore({
      Axios: Axios,
      proxyPath: '/gw',
      clubApiProxyPath: '',
      autoSubmitVerifyCode: false,
      storeType: 'login',
      countryCode: countryCode,
      onToastMsg: (msg) => {
        Message.error(msg)
      },
      onModalConfirm: Modal.Confirm,
      handleAuthSecurity: this.toAuthSecurity,
      handleResetPwd: this.toResetPassword,
      handleNotRegistered: this.notRegistered,
      handleForgotPassword: this.forgotPassword,
      handleLoginFreeze: this.loginFreeze,
      onLogined: this.logined,
      historyUsers: users,
      autoAccount: props.defaultAccount,
      googleConfig: {
        redirect_uri: window.location.origin,
      },
      traceMidMap: {
        'login': '41.2.4',
        'facebookToken': '41.11.1',
        'googleToken': '41.11.2',
        'verifyCode': '41.13.1',
      },
      trace: trace,
    })

    if (props.input_account) {
      this.loginStore.pushStep('input-account')
    }
  }

  toSignUp = (account) => {
    trace.click({ mid: '41.2.1' })
    this.props.changeContentType('signup', account)
  }

  toResetPassword = (account) => {
    this.props.changeContentType('resetpwd', account)
  }

  notRegistered = (accountVal, isPhoneNum) => {
    const message = isPhoneNum
      ? 'Your phone number has not been registered. Sign up now?'
      : `The email has not been registered.Do you want to sign up now?`
    Modal.Confirm({
      content: message,
      cancelText: 'Cancel',
      okText: 'Sign up',
      onOk: () => { this.toSignUp(accountVal) },
    })
  }

  forgotPassword = (accountVal, _isPhoneNum) => {
    const message = 'Please enter a valid password. Or you can Reset password.'
    Modal.Confirm({
      content: message,
      cancelText: 'Cancel',
      okText: 'Reset password',
      onOk: () => { this.toResetPassword(accountVal) },
    })
  }

  loginFreeze = (accountVal) => {
    Modal.Confirm({
      content: 'Maximum login attempts reached.Retry after 24 hours or reset your password.',
      onCancel: '',
      cancelText: 'Cancel',
      okText: 'Reset password',
      onOk: () => { this.toResetPassword(accountVal) },
    })
  }

  toAuthSecurity = (tmp_auth, account) => {
    localStorage.setItem('tmp_authorization', tmp_auth)
    this.props.changeContentType('security', account)
  }

  logined = (userInfo) => {
    Message.success('Log in successfully')
    setTimeout(() => {
      const { redirect } = utils.getQuery()
      const re_url = redirect || this.props.login_redirect
      logInCallBack(userInfo, re_url)
    }, 1000)
  }

  navBack = () => {
    const { stepList, popStep } = this.loginStore
    if (stepList.length > 1) {
      popStep()
    } else {
      window.history.go(-1)
    }
  }

  getStepContent = () => {
    const { currentStep, loginByCode, loadingState, replaceStep } = this.loginStore
    switch (currentStep) {
      case 'before-login':
        return <BeforeLogIn store={this.loginStore} toSignUp={this.toSignUp} />
      case 'default-account':
        return <DefaultAccount store={this.loginStore} toSignUp={this.toSignUp} />
      case 'input-account':
        return <InputAccount store={this.loginStore} toSignUp={this.toSignUp} />
      case 'verify-code':
        return <VerifyCode
          store={this.loginStore}
          handleContinue={() => {
            loginByCode()
          }}
          btnLoading={loadingState.login}
          usePassword={() => { replaceStep('input-password') }}
        />
      case 'input-password':
        return <InputPassword store={this.loginStore} />
      default:
        return <InputAccount store={this.loginStore} toSignUp={this.toSignUp} />
    }
  }

  render () {
    return <div>
      {/* <NavHeader title='Login' customBack={this.navBack} /> */}
      <div className={styles.login}>
        {
          this.getStepContent()
        }
      </div>
    </div>
  }
}
export default LoginPage

import React from 'react'
import PropTypes from 'prop-types'
import { LoginStore, SignUpStore } from 'front-components'
import { observer } from 'mobx-react'

import Axios from '@/setup/axios'
import { logInCallBack, getCountry } from 'pc/tool'

import { Message, Modal, CaptchaModal, trace, utils } from '@/pages/components'
import VerifyCode from '../common/VerifyCode'
import InputAccount from './components/InputAccount'
import InputPassword from './components/InputPassword'

import * as styles from './index.less'

@observer
class SignUpPage extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    changeContentType: PropTypes.func,
    defaultAccount: PropTypes.string,
    login_redirect: PropTypes.string,
  }
  constructor (props) {
    super(props)

    this.state = {
      captVisible: false,
      bizKey: '',
    }

    const countryCode = getCountry()

    this.signUpStore = new SignUpStore({
      Axios: Axios,
      proxyPath: '/gw',
      clubApiProxyPath: '',
      autoSubmitVerifyCode: false,
      storeType: 'signup',
      countryCode: countryCode,
      onToastMsg: (msg) => {
        Message.error(msg)
      },
      onModalConfirm: Modal.Confirm,
      handleLogin: this.toLogin,
      onRegisteredEmail: this.registeredEmail,
      onRegisteredPhone: this.registeredPhone,
      onRegisterLimit: this.registerTooMany,
      onVerifyByCaptcha: this.onVerifyByCaptcha,
      onLogined: this.logined,
      defaultAccount: {
        account: props.defaultAccount || '',
      },
      traceMidMap: {
        'signUp': '41.2.3',
        'facebookToken': '41.11.1',
        'googleToken': '41.11.2',
        'verifyCode': '41.13.2',
      },
      trace: trace,
    })
    this.loginStore = new LoginStore({
      Axios: Axios,
      proxyPath: '/gw',
      clubApiProxyPath: '',
      countryCode: 'in',
      onToastMsg: (msg) => {
        Message.error(msg)
      },
      onLogined: (userInfo) => { this.logined(userInfo, 'isLogin') },
      googleConfig: {
        redirect_uri: window.location.origin,
      },
      traceMidMap: {
        'login': '41.2.4',
        'facebookToken': '41.11.1',
        'googleToken': '41.11.2',
      },
      trace: trace,
    })

    let phoneSignup = (window?.phoneSignupCountries || '').split(',').includes(countryCode)
    let emailSignup = (window?.emailSignupCountries || '').split(',').includes(countryCode)
    // 如果两个都是false, 则默认都设为手机注册
    if (!phoneSignup && !emailSignup) {
      phoneSignup = true
      emailSignup = false
    }
    this.onlyPhone = phoneSignup && !emailSignup
    this.onlyEmail = !phoneSignup && emailSignup
    const currentSignupType = this.signUpStore.signAccountType
    if (this.onlyPhone && currentSignupType === 'email') {
      this.signUpStore.toggleSignupType()
    } else if (this.onlyEmail && currentSignupType === 'phone') {
      this.signUpStore.toggleSignupType()
    }
  }

  toLogin = (account = '') => {
    trace.click({ mid: '41.2.2' })
    this.props.changeContentType('login', account)
  }

  registerTooMany = () => {
    Modal.Confirm({
      content: `Sign up failed as you're reached maximum limit, please use existing account to login`,
      cancelText: '',
      okText: 'OK',
    })
  }

  registeredPhone = (userInfo) => {
    const { account, phoneCode } = this.signUpStore
    Modal.Confirm({
      content: `+${phoneCode} ${account.value} already exists please log in now`,
      cancelText: '',
      okText: 'Log in now',
      onOk: () => { this.logined(userInfo, 'isLogin') },
    })
  }

  registeredEmail = (account) => {
    Modal.Confirm({
      content: `${account} already exists. Please log in now`,
      cancelText: '',
      okText: 'Log In Now',
      onOk: () => { this.toLogin(account) },
    })
  }

  onVerifyByCaptcha = (bizKey) => {
    this.toggleLoginModal('none')
    this.setState({
      bizKey,
      captVisible: true,
    })
  }

  // 记录表单信息，使用style.display 隐藏显示 loginSignUpModal
  toggleLoginModal = (display = '') => {
    const loginSignUpModal = document.querySelector('.loginSignUpModal')
    loginSignUpModal.style.display = display
  }

  onCaptchaSuccess = () => {
    const { isPhoneNum, pushStep, currentStep } = this.signUpStore
    this.toggleLoginModal()
    this.setState({
      captVisible: false,
    })
    if (currentStep !== 'verify-code') {
      pushStep(isPhoneNum ? 'verify-code' : 'input-password')
    }
  }

  onCaptchaCancel = () => {
    this.toggleLoginModal()
    this.setState({
      captVisible: false,
    })
  }

  /**
   * 注册后自动登录的
   * isLoginCb直接登录的提示‘login successfully’
   */
  logined = (userInfo, isLoginCb) => {
    if (!isLoginCb) {
      Message.success('Sign up successfully')
    } else {
      Message.success('Log in successfully')
    }
    setTimeout(() => {
      const { redirect } = utils.getQuery()
      logInCallBack(userInfo, redirect || this.props.login_redirect)
    }, 1000)
  }

  navBack = () => {
    const { stepList, popStep, currentStep } = this.signUpStore
    if (currentStep === 'verify-code') {
      Modal.Confirm({
        content: 'Are you sure you want to go back?',
        cancelText: 'No',
        okText: 'Yes',
        onOk: () => { popStep() },
      })
    } else if (stepList.length > 1) {
      popStep()
    } else {
      window.history.go(-1)
    }
  }

  getStepContent = () => {
    const { currentStep, handleSignUp, loadingState } = this.signUpStore
    switch (currentStep) {
      case 'input-account':
        return <InputAccount
          store={this.signUpStore}
          login_store={this.loginStore}
          toLogin={this.toLogin}
        />
      case 'verify-code':
        return <VerifyCode
          store={this.signUpStore}
          handleContinue={() => {
            handleSignUp()
          }}
          captVisible={this.state.captVisible}
          btnLoading={loadingState.signUp}
        />
      case 'input-password':
        return <InputPassword captVisible={this.state.captVisible} store={this.signUpStore} />
      default:
        return <InputAccount
          store={this.signUpStore}
          login_store={this.loginStore}
          toLogin={this.toLogin}
        />
    }
  }

  render () {
    return <div>
      {/* <NavHeader title='Sign Up' customBack={this.navBack} /> */}
      <div className={styles.pcsite_sign}>
        {
          this.getStepContent()
        }
      </div>
      <CaptchaModal
        visible={this.state.captVisible}
        bizType={2}
        bizKey={this.state.bizKey}
        onVerifySuccess={this.onCaptchaSuccess}
        handleCancel={this.onCaptchaCancel}
      />
    </div>
  }
}
export default SignUpPage

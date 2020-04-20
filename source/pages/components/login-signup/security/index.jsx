/*
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-07-01 16:20:48
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2020-04-03 15:38:13
 */

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { LoadingPlaceholder } from 'cf-ui-mobile'

import { COUNTRY_MAP } from '@/constants'

import SecurityStore from './store'
import { utils, Icon, Modal, Message, Button, InputItem, InputVerifyCode, VoiceCodeTips, ModalHeader } from '@/pages/components'
import { logInCallBack, getCountry } from 'pc/tool'

import * as styles from './index.less'

@observer
class SecurityList extends React.Component {
  static propTypes = {
    store: PropTypes.object,
    site: PropTypes.string,
    onBack: PropTypes.func,
    account: PropTypes.string,
    login_redirect: PropTypes.string,
  }
  constructor (props) {
    super(props)
    this.store = new SecurityStore()
    this.state = {
      showVerify: false,
      currentItem: {},
      currentTimers: {},
      phoneCodeErrorMsg: '',
      emailCodeErrorMsg: '',
      consigneeNameErrorMsg: '',
      orderPhoneErrorMsg: '',
      orderSecondStage: false,
      phoneCodeVal: '',
      emailCodeVal: '',
      consigneeNameVal: '',
      orderPhoneVal: '',
      sendedPhoneCode: false,
      sendedEmailCode: false,
      phoneCodeType: 1, // 当前手机授信方式时，1: 短信 2: 语音
      submitLoading: false,
      getCodeLoading: false,
    }
    let country_code = getCountry()
    this.country_info = COUNTRY_MAP[country_code]
    this.localPhoneCode = this.country_info?.phonePrefix
    this.phoneLength = this.country_info?.phoneLength
    this.verifyTimer = null
    this.emailInputEl = null
    this.phoneInputEl = null
    this.orderInputEl = null
    this.nameInputEl = null
  }

  cf_logo = require('@/img/logo_cf.png')

  async componentWillMount () {
    let range = utils.getQuery().range || 1
    try {
      const security_list = await this.store.getSecurityList(range)
      const haveGoogleAuth = security_list.find(item => item.type === 6)
      // 存在google验证方式，且在站外才加载
      if (haveGoogleAuth) {
        window.initGapi = () => {
          window.gapi?.load('auth2', (data) => {
            window.gapi?.auth2.init({
              client_id: '50259023483-a0u2iapki9cu628tt4aqmms1o1grid4g.apps.googleusercontent.com',
            })
          })
        }
        utils.asyncLoadScript('https://apis.google.com/js/platform.js?onload=initGapi')
      }
    } catch (err) {
      const message = err.message
      Message.error(message)
    }
  }

  // 手机、邮箱验证码倒计时
  startCodeTimer = () => {
    if (this.verifyTimer) return
    this.verifyTimer = setInterval(() => {
      const { currentTimers } = this.state
      let newTimers = {}
      Object.keys(currentTimers).forEach(key => {
        newTimers[key] = currentTimers[key] ? currentTimers[key] - 1 : 0
      })
      if (JSON.stringify(newTimers) !== JSON.stringify(this.state.currentTimers)) {
        this.setState({
          currentTimers: newTimers,
        })
      }
    }, 1000)
  }

  selectArrow = (seItem) => {
    if (seItem.disable) {
      const ERR_MSG = ['',
        'For account security, the phone number associated with your account will be available 24 hours later.',
        'You‘ve reached maximum requests for code.Please Try again in 24 hours.',
      ]
      const message = ERR_MSG[seItem.disableReason]
      if (message) {
        Message.error(message, 3000)
      }
      return
    }
    const { currentTimers } = this.state
    this.setState({
      currentItem: seItem,
      phoneCodeErrorMsg: '',
      emailCodeErrorMsg: '',
      consigneeNameErrorMsg: '',
      orderPhoneErrorMsg: '',
    })
    // FB授权
    if (seItem.type === 5) {
      window.FB?.login((res) => {
        this.thirdLoginBack(res?.authResponse?.accessToken, seItem.type)
      })
    } else if (seItem.type === 6) { // Google授权
      console.log(window.gapi)
      window.gapi?.auth2?.getAuthInstance?.().grantOfflineAccess().then(function (res) {
        this.thirdLoginBack(res?.code, seItem.type)
      })
    } else {
      this.setState({
        currentItem: seItem,
        showVerify: true,
      }, () => {
        const type = this.state?.currentItem?.type
        if ((type === 1 || type === 2) && !currentTimers[type]) {
          this.getPhoneEmailCode(1)
        }
      })
    }
  }

  thirdLoginBack = (accessToken, type) => {
    if (accessToken) {
      const params = {
        methodType: type,
        thirdAccessToken: accessToken,
      }
      this.submitVerify(params)
    } else {
      Message.error('Faild. Please try again later.');
    }
  }

  inputFocus = () => {
    const { currentItem, orderSecondStage, phoneCodeErrorMsg, emailCodeErrorMsg, consigneeNameErrorMsg, orderPhoneErrorMsg } = this.state
    const type = currentItem.type
    this.setState({
      phoneCodeErrorMsg: type === 1 ? '' : phoneCodeErrorMsg,
      emailCodeErrorMsg: type === 2 ? '' : emailCodeErrorMsg,
      consigneeNameErrorMsg: type === 3 ? '' : consigneeNameErrorMsg,
      orderPhoneErrorMsg: orderSecondStage ? '' : orderPhoneErrorMsg,
    })
  }

  changeCode = (val, type) => {
    const { phoneCodeErrorMsg, emailCodeErrorMsg } = this.state
    if (type === 'phone') {
      this.setState({
        phoneCodeVal: val,
        phoneCodeErrorMsg: val ? '' : phoneCodeErrorMsg,
      })
    } else {
      this.setState({
        emailCodeVal: val,
        emailCodeErrorMsg: val ? '' : emailCodeErrorMsg,
      })
    }
  }

  submitVerify = (params) => {
    if (this.state.submitLoading) return
    this.setState({
      submitLoading: true,
    })
    this.store.submitVerifyInfo(params).then(result => {
      const userInfo = result.data?.body?.userProfileDTO
      if (userInfo) {
        Message.success('Log in successfully')
        userInfo.loginAccount = this.props.account
        const { redirect } = utils.getQuery() || this.props.login_redirect
        localStorage.removeItem('tmp_authorization')
        logInCallBack(userInfo, redirect)
      } else {
        const { code, message } = result.data
        this.dealSubmitErr(code, message, params.methodType)
      }
    }).catch(err => {
      let { message, code } = err?.response?.data || {}
      this.dealSubmitErr(code, message, params.methodType)
    }).finally(() => {
      if (this.phoneInputEl) this.phoneInputEl.blur()
      if (this.emailInputEl) this.emailInputEl.blur()
      this.setState({
        submitLoading: false,
      })
    })
  }

  dealSubmitErr = (code, message, methodType) => {
    let page_show_error = false
    if (!message) {
      message = 'Network is unstable. Please try again'
    }
    if (code === 10610006) {
      page_show_error = true
      message = 'The name you entered does not match.'
    } else if (code === 26107 || code === 13001) {
      page_show_error = true
      message = 'Please enter a valid verification code.'
    } else if (code === 2 || code === 10610007) {
      page_show_error = true
      message = 'The number you entered does not match.'
    }
    // 在表单下方提示错误
    if (page_show_error) {
      this.setState({
        phoneCodeErrorMsg: methodType === 1 ? message : '',
        emailCodeErrorMsg: methodType === 2 ? message : '',
        consigneeNameErrorMsg: methodType === 3 ? message : '',
        orderPhoneErrorMsg: methodType === 4 ? message : '',
      })
    } else {
      // toast 提示错误
      Message.error(message)
    }
  }

  changeOrderVal = (val) => {
    const { orderSecondStage, orderPhoneErrorMsg, consigneeNameErrorMsg } = this.state
    if (orderSecondStage) {
      this.setState({
        orderPhoneVal: val ? val.replace(/\s/g, '').slice(0, this.phoneLength) : '',
        orderPhoneErrorMsg: val ? '' : orderPhoneErrorMsg,
      })
    } else {
      this.setState({
        consigneeNameVal: val,
        consigneeNameErrorMsg: val ? '' : consigneeNameErrorMsg,
      })
    }
  }

  hanleSubmitVerify = async () => {
    const { currentItem, phoneCodeVal, emailCodeVal, orderSecondStage, consigneeNameVal, orderPhoneVal } = this.state
    const type = currentItem.type
    const showOrderName = (type === 3 || type === 4) && !orderSecondStage
    const showOrderPhone = (type === 3 || type === 4) && orderSecondStage
    let params = {}
    if (type === 1) {
      params = {
        methodType: 1,
        verifyCode: phoneCodeVal,
      }
    } else if (type === 2) {
      params = {
        methodType: 2,
        verifyCode: emailCodeVal,
      }
    } else if (showOrderPhone) {
      params.methodType = 4
      params.phoneCode = `${this.localPhoneCode}`
      params.phoneNum = orderPhoneVal
    } else if (showOrderName) {
      if (!consigneeNameVal.trim()) {
        return
      }
      params.methodType = 3
      params.consigneeName = consigneeNameVal
    }
    this.submitVerify(params)
  }

  getPhoneEmailCode = (phoneCodeType) => {
    if (this.state.getCodeLoading) return
    const seItem = this.state.currentItem;
    const { setDisableItem } = this.store
    let { currentTimers } = this.state
    this.setState({
      getCodeLoading: true,
      phoneCodeType: phoneCodeType || 1,
    })
    this.store.getVerifyCode(seItem, phoneCodeType || 1).then(result => {
      currentTimers[seItem.type] = result?.body?.nextSendSecond || 60
      this.setState({
        currentTimers,
      })
      this.startCodeTimer()
      if (seItem.type === 1 && phoneCodeType === 2) { // 如果是语音验证码
        Message.info('The phone call is coming soon, please answer it in time.');
      } else {
        Message.success('The verification code has been sent successfully');
      }
    }).catch(err => {
      let { message, code, body } = err?.response?.data || {}
      if (!message) {
        message = 'Network is unstable. Please try again'
      }
      let duration = 2000
      // 倒计时限制
      if (code === 26104 && body?.nextSendSecond) {
        currentTimers[seItem.type] = body?.nextSendSecond
        this.setState({
          currentTimers,
        })
        this.startCodeTimer()
        message = ''
        // 24小时次数限制
      } else if (code === 10610010) {
        setDisableItem(seItem.type)
        this.setState({
          showVerify: false,
        })
        duration = 3000
      }
      message && Message.error(message, duration)
    }).finally(() => {
      this.setState({
        getCodeLoading: false,
      })
      if (seItem.type === 1) {
        this.setState({
          sendedPhoneCode: true,
        })
      } else {
        this.setState({
          sendedEmailCode: true,
        })
      }
    })
  }

  resendCode = () => {
    const type = this.state?.currentItem?.type;
    const seconds = this.state.currentTimers[type]
    if (type === 1 && this.state.phoneCodeType === 2 && seconds) {
      // 发送语音状态码倒计时期间，不允许发送短信验证码
      return false;
    }
    this.getPhoneEmailCode()
  }

  handleClickTip = () => {
    const { currentItem, orderSecondStage } = this.state
    if ([3, 4].includes(currentItem.type) && !orderSecondStage) {
      this.setState({
        orderSecondStage: true,
      })
    } else {
      this.setState({
        showVerify: false,
      })
    }
  }

  renderTypeTip = () => {
    const { currentItem, currentTimers, sendedPhoneCode, sendedEmailCode, orderSecondStage, getCodeLoading, phoneCodeType } = this.state
    const type = currentItem.type
    const seconds = currentTimers[type]
    // 手机、邮箱验证
    if (type === 1 || type === 2) {
      const sended = type === 1 ? sendedPhoneCode : sendedEmailCode
      const accountTips = type === 1
        ? <>+{currentItem.phoneCode} <span className={styles.account}>{currentItem.phoneNum}</span></>
        : <span className={styles.account}>{currentItem.email}</span>
      const secondsTips = seconds && (type === 2 || phoneCodeType === 1)
        ? <span className={styles.timer_sen}> ( {seconds}s ) </span>
        : <span className={classnames(styles.timer_rsen, styles.pc_link_text, {
          [styles.phone_send_disabled]: type === 1 && phoneCodeType === 2 && seconds,
        })} onClick={this.resendCode}> ( { getCodeLoading ? 'Sending' : (sended ? 'Resend the code' : 'Send the code') } ) </span>

      return <div className={styles.tip_text}>
        <div>A text with a verification code has been sent to</div>
        <div> { accountTips } {secondsTips}</div>
      </div>
    } else if (type === 3 || type === 4) {
      // 订单验证
      if (orderSecondStage) {
        return <div className={styles.tip_text_order}>
          <div className={styles.tip_text_1}>Your current account already has a historical order. Please enter the consignee number of the recently paid order.</div>
          <div className={styles.tip_text_2}>*Except the number associated with your account</div>
        </div>
      } else {
        return <div className={styles.tip_text_order}>
          <div className={styles.tip_text_1}>Your current account already has a historical order. Please enter the consignee name of the recently paid order.</div>
        </div>
      }
    }
  }

  renderVerifyCodeTip = () => {
    let item = this.state.currentItem
    if (item.type === 2) {
      return 'Can’t access the email?'
    } else if (item.type === 3 || item.type === 4) {
      if (this.state.orderSecondStage) {
        return 'Can’t remember?'
      } else {
        return 'Change one to verify'
      }
    }
  }

  renderVoiceCodeEntry = () => {
    let entry = null;
    const { sendedPhoneCode, currentItem, currentTimers, phoneCodeType } = this.state;
    const timer = currentTimers[1]

    if (currentItem.type === 1) {
      if (sendedPhoneCode && !timer) { // 倒计时结束 && 已经发送过短信验证码
        entry = <div
          className={styles.voice_code}>Unable to receive the code?
          <VoiceCodeTips
            onClick={() => {
              this.getPhoneEmailCode(2);
              window.notify_add_click_event?.({
                mid: '5.1',
              })
            }}
          />
        </div>;
      } else if (timer && phoneCodeType === 1) { // 倒计时进行中 && 倒计时是短信倒计时
        entry = null;
      } else if (timer && phoneCodeType === 2) { // 倒计时进行中 && 倒计时是语音倒计时
        entry = <div className={styles.voice_code}>Unable to receive the code? Send voice code( {`${timer}`}s )</div>;
      }
    }
    return entry;
  }

  handleBack = () => {
    if (this.state.showVerify) {
      this.setState({
        showVerify: false,
      })
    } else {
      this.props.onBack()
    }
  }

  render () {
    const {
      currentItem,
      showVerify,
      orderSecondStage,
      phoneCodeVal,
      emailCodeVal,
      consigneeNameVal,
      orderPhoneVal,
      phoneCodeErrorMsg,
      emailCodeErrorMsg,
      consigneeNameErrorMsg,
      orderPhoneErrorMsg,
      submitLoading,
    } = this.state
    const { security_list, loading } = this.store
    const type = currentItem.type
    const showOrderName = (type === 3 || type === 4) && !orderSecondStage
    const showOrderPhone = (type === 3 || type === 4) && orderSecondStage
    const phone_disable = orderPhoneVal.length !== this.phoneLength
    const name_disable = !consigneeNameVal.trim()
    let btn_disable = false
    if (type === 1) {
      btn_disable = phoneCodeVal?.length < 6
    } else if (type === 2) {
      btn_disable = emailCodeVal?.length < 6
    } else {
      btn_disable = orderSecondStage ? phone_disable : name_disable
    }
    return <div className={styles.security}>
      <ModalHeader
        onBack={this.handleBack}
        title='Verify Your Identity'
        style={{ marginTop: '40px' }}
      />
      <LoadingPlaceholder
        customBlocks={<div>
          {
            [...new Array(4)].map((_, i) => <div style={{ height: '44px', background: '#eee', marginTop: '20px' }} key={i} />)
          }
        </div>}
        ready={!loading}
        firstLaunchOnly
      >
        {
          !showVerify ? <div className={styles.se_list}>
            <div className={styles.top_tips}>
              {`*This is require if your sign-in looks different because you're signing from a different browser,device,or location.`}
            </div>
            <h4 className={styles.top_title2}>How would you like to confirm your identity?</h4>
            {
              security_list.map((item, index) => {
                return <div
                  onClick={() => this.selectArrow(item)}
                  key={index}
                  className={classnames(styles.se_item, {
                    [styles.se_item_disable]: item.disable,
                  })}
                >
                  <Icon
                    className={classnames(styles.se_icon, {
                      [styles.se_icon_disable]: item.disable,
                    })}
                    name={item.icon}
                  />
                  <span className={styles.se_txt}>{item.title}</span>
                </div>
              })
            }
          </div>
            : <div className={`${styles.drawer_content}`}>
              <div className={styles.tip_content}>
                {
                  this.renderTypeTip()
                }
              </div>
              {
                /* showVerify 再渲染input 使autoFocus生效 */
                showVerify ? <div className={styles.input_container}>
                  {
                    currentItem.type === 1 ? <div>
                      <div className={styles.code_title}>Enter the Verification Code</div>
                      <InputVerifyCode
                        ref={(el) => { this.phoneInputEl = el }}
                        value={phoneCodeVal}
                        autoFocus
                        errorMsg={phoneCodeErrorMsg}
                        onChange={(val) => { this.changeCode(val, 'phone') }}
                        onFocus={this.inputFocus}
                      />
                    </div>
                      : null
                  }
                  {
                    currentItem.type === 2 ? <div>
                      <div className={styles.code_title}>Enter the Verification Code</div>
                      <InputVerifyCode
                        ref={(el) => { this.emailInputEl = el }}
                        value={emailCodeVal}
                        autoFocus
                        errorMsg={emailCodeErrorMsg}
                        onChange={(val) => { this.changeCode(val, 'email') }}
                        onFocus={this.inputFocus}
                      />
                    </div>
                      : null
                  }
                  {
                    showOrderName && <InputItem
                      value={consigneeNameVal}
                      autoFocus
                      ref={(el) => { this.orderInputEl = el }}
                      onChange={this.changeOrderVal}
                      errorMsg={consigneeNameErrorMsg}
                      className='security_input'
                      placeholder='Please enter the name'
                      togglePlaceholder={false}
                      onFocus={this.inputFocus}
                    />
                  }
                  {
                    showOrderPhone && <InputItem
                      label={this.localPhoneCode ? <span className={styles.phone_label}>+{this.localPhoneCode}</span> : null}
                      value={orderPhoneVal}
                      autoFocus
                      onChange={this.changeOrderVal}
                      ref={(el) => { this.nameInputEl = el }}
                      errorMsg={orderPhoneErrorMsg}
                      className='security_input'
                      placeholder='Please enter Phone Number'
                      type='number'
                      maxLength={this.phoneLength}
                      togglePlaceholder={false}
                      onFocus={this.inputFocus}
                    />
                  }
                </div> : null
              }
              {
                this.renderVoiceCodeEntry()
              }
              {
                type !== 1
                  ? <div className={styles.cant_access}>
                    <span style={{ cursor: 'pointer' }} onClick={this.handleClickTip}>{this.renderVerifyCodeTip()}</span>
                  </div>
                  : null
              }
              <div className={styles.drawer_btn}>
                <Button
                  disabled={submitLoading || btn_disable}
                  loading={submitLoading}
                  size='lg'
                  style={{ width: '100%' }}
                  onClick={this.hanleSubmitVerify}
                >Confirm</Button>
              </div>
            </div>
        }
      </LoadingPlaceholder>
      {
        !showVerify ? <div onClick={() => {
          Modal.Confirm({
            content: <div style={{ lineHeight: '36px' }}>Get Better Service in Our App!</div>,
            okText: 'Download App',
            onOk: () => {
              window.open('/download_app')
            },
          })
        }} className={styles.se_contact}>The above methods all can’t be accessed?</div> : null
      }
    </div>
  }
}
export default SecurityList

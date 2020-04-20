import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { hot } from 'react-hot-loader'
import classNames from 'classnames'
import { LoadingPlaceholder } from 'cf-ui-mobile'
// import submit_success from '@/img/cod_success_page/submit_success.png'
import { getAuthorization } from 'pc/tool'
import * as styles from './index.less'
import { utils, Icon, TraceStatistic, Button, Modal, CodVerifyModal, trace } from '@/pages/components'
import ModalStore from '@/pages/components/cod-verify-modal/cod_modal_store'
import { cod_verify_store } from 'pc/store'

import payment_result_store from './payment_result_store'
import facebookPixel from 'pc/setup/setup-facebook-pixel'
import _ from 'lodash'

@hot(module)
@observer
class PaySuccess extends Component {
  constructor (props) {
    super(props)
    this.payment_result_store = payment_result_store
    this.steps = [
      {
        text: 'Submit order',
        icon: 'J_Review',
        active: false,
      },
      {
        text: 'Reconfirm your order',
        icon: 'renzheng',
        active: true,
      },
      {
        text: 'Order-processing',
        icon: 'order_processing',
        active: false,
      },
    ]
    this.tips = [
      'Some of the products require COD confirmation on the phone ,we may confirm the order with you by phone within 24 hours.',
      'If the order is not confirmed within 24 hours, the order will be automatically canceled.',
      'After confirmation on the phone, we will start processing the order. ',
      'If you refuse the order at the time of delivery for an invalid reason, you will no longer be able to use COD payment option.',
      'You can check your order information in your email.',
    ]
    const { orderName = '', payChannel } = utils.getQuery()
    this.orderName = orderName
    this.payChannel = payChannel
    this.state = {
      protect_modal_visible: false,
    }
    this.isLogin = getAuthorization() // 是否已登录
  }

  componentWillMount () {
    if (this.payChannel === 'cod') {
      cod_verify_store.getOrderType(this.orderName)
    }
    this.payment_result_store.getOrderDetail(this.orderName).then(res => {
      res.forEach(async resItem => {
        const { orderLines } = resItem
        if (orderLines) {
          orderLines.forEach(item => {
            trace.pay({
              mid: '9.1',
              ono: resItem.orderName,
              pri: item.list_price_us,
              pnu: item.quantity,
              pid: item.product_template_id,
            })
          })
          // 先请求接口，拿到标示，判断是否发起上报
          const flag = await facebookPixel.facebookNeedToReport(orderLines.map(item => item.product_no))
          if (flag) {
            facebookPixel.paymentSuccess({
              value: resItem.totalUS,
              contentName: resItem.orderName,
              contentIds: orderLines.map(item => item.product_no),
            })
          }
        }
      })
    })
  }

  componentDidMount () {
    // 来打个点 for amp cps广告
    const url = `https://www.clubfactory.com/amp/affiliate/conversion?t=${Date.now()}`
    TraceStatistic(url)
  }

  toOrders = () => {
    window.location.href = '/user?type=order&active=3'
  }

  toHome = () => {
    window.location.href = `/`
  }

  downLoadApp = () => {
    // 这个页面有问题，暂不跳转 ios的跳不过去
    // window.location.href = `/download_app`
  }

  preparation_time = (prepare_time, shipping_time) => {
    if (prepare_time && shipping_time) {
      const [ p_l, p_h ] = prepare_time && prepare_time.split('-')
      const [ s_l, s_h ] = shipping_time && shipping_time.split('-')
      if (p_l && p_h && s_l && s_h) {
        return `${+p_l + +s_l}-${+p_h + +s_h}`
      }
    }

    return ''
  }

  renderCodFlow = (cod_order_type) => {
    switch (cod_order_type) {
      case 1:
        return <div className={styles.preparing}>
          <div className={styles.icon}>
            <Icon name="Processing1" />
          </div>
          <h3>Order Preparing</h3>
          <div className={styles.notice}>
            We will process your order as soon as possible.<br />
            If you refuse the order at the time of delivery for no reason, you will no longer be able to use COD payment option.
          </div>
        </div>
      case 2:
        ModalStore.toggleModal(true)
        return <div className={styles.processing}>
          <div className={styles.steps}>
            {
              this.steps.map((item, i) => {
                return <div className={classNames(styles.step_item, { [styles.active]: item.active })} key={i}>
                  <div className={styles.step_icon}>
                    <Icon className={styles.s_icon} name={item.icon} />
                  </div>
                  {
                    i !== 0 ? <div className={styles.icon_arrow}>
                      <Icon className={styles.icon_arrow_inner} name='meilizhitiaozhuan' />
                    </div> : null
                  }
                  <div>{item.text}</div>
                </div>
              })
            }
          </div>
          <p>We need to verify your phone number to process the order.</p>
          <p>The unconfirmed orders will be automatically canceled.</p>
          <Button
            className={styles.button}
            size='lg'
            onClick={() => {
              ModalStore.toggleModal(true)
            }}
          >Confirm Order</Button>
        </div>
      case 3:
        return <>
          <div className={styles.steps}>
            {
              this.steps.map((item, i) => {
                return <div className={classNames(styles.step_item, { [styles.active]: item.active })} key={i}>
                  <div className={styles.step_icon}>
                    <Icon className={styles.s_icon} name={item.icon} />
                  </div>
                  {
                    i !== 0 ? <div className={styles.icon_arrow}>
                      <Icon className={styles.icon_arrow_inner} name='meilizhitiaozhuan' />
                    </div> : null
                  }
                  <div>{item.text}</div>
                </div>
              })
            }
          </div>
          <div className={styles.tips}>
            {
              this.tips.map((tip, i) => {
                return <div key={i}>{
                  `${i + 1}. ${tip}`
                }</div>
              })
            }
          </div>
        </>
      default:
        return null
    }
  }

  render () {
    const isOneOrder = this.orderName.split(',').length === 1

    const { loading } = this.payment_result_store

    const {
      orderTotal,
      deliveryInfo,
      currencySymbol,
      payChannel,
    } = this.payment_result_store.detail_infos[0] || {}
    const {
      shippingCity,
      shippingCountry,
      shippingName,
      shippingPhone,
      shippingState,
      shippingStreet2,
      phoneAreaCode,
    } = _.get(this.payment_result_store, 'detail_infos[0].shippingInfo', {})

    // 如果只有单个物流信息，则显示；反之不显示
    const details = _.map(this.payment_result_store.detail_infos, 'deliveryInfo')
    const showDeliveryInfoName = _.uniqBy(details, 'deliveryName').length === 1
    // const showDeliveryTime = _.uniq(
    //   details.map(detail => this.preparation_time(detail.prepareTime, detail.shippingTime))
    // ).length === 1

    // 后端要改老服务，多订单就不显示物流信息：http://jira.yuceyi.com/browse/APPTEAM-8664
    const showDeliveryTime = isOneOrder

    const { cod_order_type } = cod_verify_store

    return (
      <div className={styles.cod_page}>
        <div className={styles.page_content}>
          <section>
            <LoadingPlaceholder ready={!loading} customBlocks={<div className={styles.loading_block}></div>}>
              <div>
                { payChannel === 'cod' || this.payChannel === 'cod'
                  ? this.renderCodFlow(cod_order_type)
                  : <div className={styles.success_icon_warp}>
                    <div><Icon className={styles.su_icon} name='check'/></div>
                    <h5>Payment Successful</h5>
                    <p>You can check your order information in your email. </p>
                  </div>
                }
              </div>
            </LoadingPlaceholder>
            <section className={styles.info}>
              {/* <section className={styles.info_half}>
                <h4>Order</h4>
                <p>{orderName}</p>
              </section> */}
              <section className={styles.info_full}>
                <h4>Total</h4>
                <p>{currencySymbol} {orderTotal}</p>
              </section>
              {
                showDeliveryInfoName && <section className={styles.info_half}>
                  <h4>Shipping Courier</h4>
                  <p>{ deliveryInfo?.deliveryName }</p>
                </section>
              }
              {
                showDeliveryTime && <section className={styles.info_half}>
                  <h4>Preparing & Shipping</h4>
                  <p>{ this.preparation_time(deliveryInfo?.prepareTime, deliveryInfo?.shippingTime) } days</p>
                </section>
              }
              <section className={styles.info_full}>
                <h4>Shipping To</h4>
                <p>{ shippingName }</p>
                <p>{phoneAreaCode} {shippingPhone}</p>
                <p>{shippingStreet2}, {shippingState}, {shippingCity}, {shippingCountry}</p>
              </section>
            </section>
            {/* <div className={styles.success_tip}>
              <Icon name="zhuyi" className={styles.notice} />
              <section className={styles.text_container}>
                <div className={styles.text1}>Protect yourself from scams!: </div>
                <div
                  className={styles.text2}
                >Please do not  contact any contact number posted outside Club Factory app/website. Club Factory will not be responsible for any loss caused by it.
                  <span className={styles.link_text} onClick={() => { this.setState({ protect_modal_visible: true }) }} > See details.</span>
                </div>
              </section>
            </div> */}
            { cod_order_type !== 2 && <div className={styles.btns}>
              <Button
                className={styles.detail}
                type='white'
                size='lg'
                onClick={this.toOrders}
              >
                View My Orders
              </Button>
              <Button
                className={styles.shopping}
                size='lg'
                onClick={this.toHome}
              >
                Continue to Shopping
              </Button>
            </div> }
          </section>
        </div>
        <div className={classNames(styles.success_bottom, styles.success_bottom_2)}>
          <div onClick={this.downLoadApp}>
            <img src={require('@/img/mail.png')}/>
            <div>
              <h5>
                Please contact us through our email <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="mailto:customerservice@kartindian.com"
                  style={{ color: '#398DE6' }}
                >
                  customerservice@kartindian.com
                </a> for after-sales service.</h5>
            </div>
          </div>
        </div>
        <Modal
          title='Protect Yourself From Scams'
          className={styles.protect_modal}
          showCloseIcon
          onCancel={() => { this.setState({ protect_modal_visible: false }) }}
          visible={this.state.protect_modal_visible}>
          <div>
            <p>Dear customer,</p>
            <p>Recently some frauds disguised as Club Factory ask for your bank card information, transaction information, transfer records or other personal information.</p>
            <p>Club Factory assures you that we will never ask for privacy information from our customers in any way. Please protect your personal information, and do not leak to any strangers.</p>
            <p>Do not trust any CLUB FACTORY Customer Care Number released on the internet. If you need any help, please contact online support in our Club Factory App</p>
            <Button
              onClick={() => { this.setState({ protect_modal_visible: false }) }}
              className={styles.protect_btn}
              type='white'
              size='large'
            >OK</Button>
          </div>
        </Modal>

        <CodVerifyModal
          phone={shippingPhone}
          areaCode={phoneAreaCode}
          onVerifySuccess={() => {
            cod_verify_store.getOrderType(this.orderName)
            ModalStore.toggleModal(false)
          }}
          orderNameList={this.orderName.split(',')}
        />
      </div>
    )
  }
}

export default PaySuccess

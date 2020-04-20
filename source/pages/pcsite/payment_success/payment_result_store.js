/*
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-05-13 20:01:53
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-12-19 10:36:47
 */
// import React from 'react'
import { action, observable } from 'mobx'
import axios from '@/setup/axios'

class PaymentResultStore {
  @observable orderName = ''
  @observable error_code = ''
  @observable error_message = ''
  @observable detail_infos = []
  @observable loading = true

  @action.bound
  getOrderDetail (orderName) {
    this.orderName = orderName
    this.error_code = null
    this.error_message = null
    this.detail_infos = []
    return axios.get(`/v1/orders/multi?order_name_list=${orderName}&is_detail=true`)
      .then(({ data }) => {
        data.order_infos?.map((order, index) => {
          const orderLines = order.order_lines || []
          const deliveryInfo = {
            deliveryName: order.delivery_info.delivery_name,
            prepareTime: order.delivery_info.prepare_time,
            shippingTime: order.delivery_info.shipping_time,
          }
          const payInfo = {
            deliveryPriceLocal: order.pay_info.delivery_price_local || 0,
            deliveryPriceUS: order.pay_info.delivery_price_us || 0,
            deliveryWay: order.pay_info.delivery_way,
            eachAmount: order.pay_info.each_amount,
            extraFee: order.pay_info.extra_fee || 0,
            installments: order.pay_info.installments,
            subtotalLocal: order.pay_info.subtotal_local || 0,
            balanceLocal: order.pay_info.balance_local || 0,
            codPriceLocal: order.pay_info.cod_price_local || 0,
            taxLocal: order.pay_info.tax_real_price_local || 0,
          }
          const shippingInfo = {
            phoneAreaCode: order.shipping_info.phone_area_code,
            shippingCity: order.shipping_info.shipping_city,
            shippingCountry: order.shipping_info.shipping_country,
            shippingEmail: order.shipping_info.shipping_email,
            shippingName: order.shipping_info.shipping_name,
            shippingPhone: order.shipping_info.shipping_phone,
            shippingState: order.shipping_info.shipping_state,
            shippingStreet2: order.shipping_info.shipping_street2,
            shippingZip: order.shipping_info.shipping_zip,
          }
          this.detail_infos[index] = {
            discount: order.discount || 0,
            expiryString: order.expiry_string,
            arriveDate: order.arrive_date,
            deliveryInfo: deliveryInfo,
            orderName: order.order_name,
            currencySymbol: order.currency_symbol,
            paymentDate: order.payment_date,
            refundInfo: order.refund_info,
            payChannel: order.pay_channel,
            totalLocal: order.total_local,
            totalItems: order.total_items,
            totalUS: order.total_us,
            showState: order.show_state,
            taxLine: order.tax_line,
            shippingInfo: shippingInfo,
            payInfo: payInfo,
            orderLines: orderLines,
            shippingCountryCode: order.country_code,
            paymentMethod: order._payment_method,
            virtualSellerInfo: order.virtual_seller_info || {},
            orderTotal: order.pay_info.pay_amount_local,
          }
        })

        // let item = data.orderDetailDTO
        // if (item.returnRefundDTO && item.returnRefundDTO.returnRefundSkuList) {
        //   let returnRefundDTOList = item.returnRefundDTO.returnRefundSkuList || []
        //   // 退货信息与商品匹配
        //   item.orderLineDTOList.map(skuProdct => {
        //     let refundIndex = returnRefundDTOList.findIndex(item => item.skuId === skuProdct.skuId)
        //     if (refundIndex !== -1) {
        //       let refund = returnRefundDTOList[refundIndex]
        //       // computedRefundReturnState返回: { reTag, tips }
        //       let refundComputedInfo = orderUtils.computedRefundReturnState(refund)

        //       skuProdct.refundInfo = Object.assign({}, refundComputedInfo, refund)
        //     }
        //   })
        //   // orderLogisticsDTO
        //   if (item.orderLogisticsDTO) {
        //     item.orderLogisticsDTO.logisticsTrack = item.orderLogisticsDTO.logisticsTrack?.sort((a, b) => a.updateAt - b.updateAt) || []
        //   }
        // }
        return this.detail_infos
      }).finally(() => {
        this.loading = false
      }).catch((err) => {
        console.log(err)
      })
  }
}

export default new PaymentResultStore()

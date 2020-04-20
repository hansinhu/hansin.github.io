import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import * as styles from './index.less'

const AddressInfo = (props) => {
  const { addressDetail, className } = props
  let address = ''
  let receiver = ''
  let phone = ''
  if (addressDetail.addressFrom === 'order_info') {
    address = [
      addressDetail.shippingStreet2,
      addressDetail.shippingStreet,
      addressDetail.shippingCity,
      addressDetail.shippingState,
      addressDetail.shippingZip,
      addressDetail.shippingCountry,
    ].filter(item => !!item !== false).join(' ')
    receiver = addressDetail.shippingName
    phone = addressDetail.shippingPhone
  } else {
    address = [
      addressDetail.detail,
      addressDetail.city,
      addressDetail.state,
      addressDetail.countryName,
      addressDetail.zipCode,
    ].filter(item => !!item !== false).join(' ')
    receiver = addressDetail.receiver
    phone = `+${addressDetail.areaCode} ${addressDetail.phone}`
  }
  const shipTypeMap = {
    '0': 'Home',
    '1': 'Office',
  }
  return <div className={classNames(styles.address_info, className)}>
    <div className={styles.user_name}>
      <span>{receiver}</span>
      {
        shipTypeMap[`${addressDetail.shippingTimeType}`] ? <span>{shipTypeMap[`${addressDetail.shippingTimeType}`]}</span> : null
      }
    </div>
    <div className={styles.phone}>{phone}</div>
    <div className={styles.address}>{address}</div>
  </div>
}

AddressInfo.propTypes = {
  addressDetail: PropTypes.object.isRequired,
  className: PropTypes.string,
}

AddressInfo.defaultProps = {
  addressDetail: {},
}

export default AddressInfo

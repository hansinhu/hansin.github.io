/*
 * @file Number输入，封装自cf-ui-mobile
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-10-15 15:58:59
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-10-15 16:01:15
 */

import React from 'react';
import classNames from 'classnames'
import propTypes from 'prop-types'
import { InputNumber } from 'cf-ui-mobile'

require('./index.less')

const PcInputNumber = (props) => {
  return <InputNumber
    {...props}
    pointerEvents={true}
    className={classNames('cf_input_number', props.className)}
  />
}

PcInputNumber.propTypes = {
  className: propTypes.string,
}

export default PcInputNumber

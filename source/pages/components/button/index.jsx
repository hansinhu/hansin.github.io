/*
 * @file PC Button
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-10-15 15:48:01
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-10-15 15:48:26
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types'

import { LoadingIcon } from '@/pages/components'
import styles from './index.less'

class Button extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
  }

  static defaultProps = {
    type: 'primary', // white light
    size: 'md', // 'xs', 'sm', 'md', 'lg', 'xlg'
  }

  handleClick = () => {
    const { onClick, disabled, loading } = this.props
    if (disabled || loading) {
      return
    }
    onClick && onClick()
  }

  render () {
    const { children, disabled, loading, style, className, size, type } = this.props
    const btnCls = classnames(
      styles.cf_btn,
      styles[`cf_btn_${size}`],
      styles[`cf_btn_${type}`],
      {
        [styles.cf_btn_disabled]: disabled || loading,
      },
      className,
    )
    const iconSize = size === 'xs' || size === 'sm' ? 20 : 24
    return <button
      className={btnCls}
      style={style}
      disabled={disabled}
      onClick={this.handleClick}
    >
      {
        loading ? <>
          <LoadingIcon
            type='circle'
            color='#fff'
            width={iconSize}
            height={iconSize}
            style={{ verticalAlign: 'middle' }}
          />&nbsp;&nbsp;
          </> : null
      }
      {children}
    </button>
  }
}

export default Button

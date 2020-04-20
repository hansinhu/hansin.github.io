import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types'
import { Icon } from '@/pages/components'
import styles from './index.less'

class Radio extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.any,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    size: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
  }
  static defaultProps = {
    checked: false,
    disabled: false,
    size: 'md',
  }

  handleChange = (e) => {
    const { onChange, disabled } = this.props
    if (disabled) return
    onChange && onChange(e)
  }
  render () {
    const { children, disabled, size, name, value, checked, className } = this.props
    const wrapCls = classnames(
      styles.cf_radio_wrapper,
      {
        [styles.cf_radio_disabled]: disabled,
      },
      className,
    )
    const checkCls = classnames(
      styles.cf_radio,
      styles[`cf_radio_${size}`],
      {
        [styles.cf_radio_checked]: checked,
      },
    )

    return (
      <label className={wrapCls}>
        <span className={checkCls}>
          <input
            type='radio'
            checked={checked}
            name={name}
            value={value}
            onChange={this.handleChange}
            disabled={disabled}
            className={styles.cf_radio_input}/>
          <Icon className={styles.cf_radio_icon} size={size} name={ checked ? 'xuanzhong1' : (disabled ? 'OvalCopy' : 'uncheck') }/>
        </span>{children}
      </label>
    )
  }
}
export default Radio

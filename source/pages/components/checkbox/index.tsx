import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Icon } from '@/pages/components'
require('./index.less')

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (param: any) => void;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
  className?: string;
}

class Checkbox extends React.Component<CheckboxProps> {
  static defaultProps = {
    checked: false,
    disabled: false,
    size: 'md',
  }

  handleChange = (e: any) => {
    const { onChange, disabled } = this.props
    if (disabled) return
    onChange && onChange(e)
  }
  render () {
    const { children, disabled, size, checked, className } = this.props
    const wrapCls = classnames(
      'cf_checkbox_wrapper',
      {
        'cf_checkbox_disabled': disabled,
      },
      className,
    )
    const checkCls = classnames(
      'cf_checkbox',
      `cf_checkbox_${size}`,
      {
        'cf_checkbox_checked': checked,
      },
    )

    return (
      <label className={wrapCls}>
        <span className={checkCls}>
          <input
            type='checkbox'
            checked={checked}
            onChange={this.handleChange}
            disabled={disabled}
            className='cf_checkbox_input'/>
          <Icon
            className='cf_checkbox_icon'
            size={size}
            name={ checked ? 'checkbox' : 'check_box' }
          />
        </span>{children}
      </label>
    )
  }
}
export default Checkbox

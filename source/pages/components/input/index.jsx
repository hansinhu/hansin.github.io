import React from 'react';
import classnames from 'classnames';
import { Icon } from '@/pages/components'
import PropTypes from 'prop-types'
require('./index.less')

class Input extends React.Component {
  static propTypes = {
    extra: PropTypes.any,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    inputRef: PropTypes.func,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    maxLength: PropTypes.number,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    errorMsg: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    autoFocus: PropTypes.bool,
    autoComplete: PropTypes.bool,
  }

  static defaultProps = {
    defaultValue: '',
    errorMsg: '',
    autoComplete: false,
    type: 'text',
    size: 'md',
  }

  myRef = null

  constructor (props) {
    super(props)
    this.state = {
      value: this.normalizeValue(props.value || props.defaultValue),
    }
  }

  componentWillReceiveProps (nextProps) {
    const reciveVal = this.normalizeValue(nextProps.value)
    if (nextProps.value !== undefined) {
      this.setState({
        value: reciveVal,
      })
    }
  }

  normalizeValue = (value) => {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    if (this.props.type === 'number') {
      return `${value}`.replace(/\D/ig, '')
    }
    return value + '';
  }

  popInputRef = (el) => {
    const { autoFocus, inputRef } = this.props
    this.myRef = el
    if (inputRef) {
      inputRef(el)
    }
    autoFocus && this.focus()
  }

  focus = () => {
    if (this.myRef) {
      this.myRef.focus()
    }
  }

  blur = () => {
    if (this.myRef) {
      this.myRef.blur()
    }
  }

  onInputChange = (event) => {
    const value = this.normalizeValue(event.target.value || '')
    this.setState({
      value: value,
    })
    const { onChange } = this.props
    onChange && onChange(value)
  }

  onInputFocus = (event) => {
    const value = this.normalizeValue(event.target.value || '')
    const { onFocus } = this.props
    onFocus && onFocus(value)
  }

  onInputBlur = (event) => {
    const value = this.normalizeValue(event.target.value || '')
    const { onBlur } = this.props
    onBlur && onBlur(value)
  }

  onInputClear = () => {
    this.setState({
      value: '',
    })
    const { onChange } = this.props
    onChange && onChange('')
  }

  render () {
    const {
      placeholder,
      errorMsg,
      extra,
      type,
      style,
      maxLength,
      disabled,
      className,
      autoComplete,
      size,
      ...restProps
    } = this.props
    const { value } = this.state
    const inputItemCls = classnames(
      'cf_input',
      `cf_input_${size}`,
      {
        'cf_input_error': errorMsg,
        'cf_input_disabled': disabled,
      },
      className,
    )
    return (
      <div className={inputItemCls}>
        <div className='cf_input_warp'>
          <div className='cf_input_control'>
            <input
              ref={this.popInputRef}
              {...restProps}
              className='cf_input_inner'
              value={this.normalizeValue(value)}
              placeholder={placeholder}
              onChange={this.onInputChange}
              defaultValue={undefined}
              style={style}
              type={type === 'number' ? 'text' : type} // 获取 type 有bug
              maxLength={maxLength}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              disabled={disabled}
              autoComplete={autoComplete ? 'on' : 'no'}
            />
            {
              extra ? <div className='cf_input_extra'>{ extra }</div> : null
            }
          </div>
        </div>
        {
          errorMsg ? <div className='cf_input_error_tips'>{errorMsg}</div> : null
        }
      </div>
    )
  }
}
export default Input

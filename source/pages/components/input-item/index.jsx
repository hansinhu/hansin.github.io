import React from 'react';
import classnames from 'classnames';
import { Icon } from '@/pages/components'
import PropTypes from 'prop-types'
require('./index.less')

class InputItem extends React.Component {
  static propTypes = {
    label: PropTypes.any,
    extra: PropTypes.any,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    inputRef: PropTypes.func,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    togglePlaceholder: PropTypes.bool,
    type: PropTypes.string,
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    errorMsg: PropTypes.node,
    clearable: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    autoFocus: PropTypes.bool,
    autoComplete: PropTypes.bool,
  }

  static defaultProps = {
    togglePlaceholder: false,
    defaultValue: '',
    errorMsg: '',
    clearable: true,
    autoComplete: false,
  }

  myRef = null

  constructor (props) {
    super(props)
    this.state = {
      value: this.normalizeValue(props.value || props.defaultValue),
      isFocus: false,
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
    this.setState({
      isFocus: true,
    })
  }

  onInputBlur = (event) => {
    const value = this.normalizeValue(event.target.value || '')
    const { onBlur } = this.props
    onBlur && onBlur(value)
    this.setState({
      isFocus: false,
    })
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
      togglePlaceholder,
      errorMsg,
      label,
      extra,
      type,
      style,
      maxLength,
      disabled,
      className,
      clearable,
      autoComplete,
      ...restProps
    } = this.props
    const { value, isFocus } = this.state
    const inputItemCls = classnames(
      'cf_input_item',
      {
        'cf_input_item_error': errorMsg,
        'cf_input_item_disabled': disabled,
        'cf_input_item_toggle': togglePlaceholder,
        'cf_input_item_focus': isFocus,
      },
      className,
    )
    const placeholderCls = classnames(
      'cf_input_item_placeholder',
      {
        'cf_input_item_top': value,
      },
    )
    return (
      <div className={inputItemCls}>
        <div className='cf_input_item_warp'>
          {
            label ? <div className='cf_input_item_label'>{label}</div> : null
          }
          <div onClick={this.focus} className='cf_input_item_control'>
            <input
              ref={this.popInputRef}
              {...restProps}
              className='cf_input_item_inner'
              value={this.normalizeValue(value)}
              placeholder={togglePlaceholder ? '' : placeholder}
              onChange={this.onInputChange}
              defaultValue={undefined}
              style={style}
              type={type === 'number' ? 'text' : type}
              maxLength={maxLength}
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              disabled={disabled}
              autoComplete={autoComplete ? 'on' : 'no'}
            />
            {
              togglePlaceholder ? <div className={placeholderCls}>{placeholder}</div> : null
            }
          </div>
          {
            clearable && !!value && !disabled ? <div className='cf_input_item_clear' onClick={this.onInputClear}><Icon size='sm' name='guanbi-copy'/></div> : null
          }
          {
            extra ? <div className='cf_input_item_extra'>{extra}</div> : null
          }
        </div>
        {
          errorMsg ? <div className='cf_input_item_error_tips'>{errorMsg}</div> : null
        }
      </div>
    )
  }
}
export default InputItem

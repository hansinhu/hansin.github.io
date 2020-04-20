import React, { Component } from 'react';
import classnames from 'classnames';
require('./index.less')

function normalizeValue (value: any, maxLength: number) {
  // 过滤特殊符号
  let val = !value ? '' : (value + '').replace(/\D/, '')
  if (val && val.length > maxLength) {
    val = val.slice(0, maxLength)
  }
  return val;
}

export interface VerifyCodeProps {
  onChange?: (value: any) => void;
  onFocus?: (value: any) => void;
  onBlur?: (value: any) => void;
  onKeyUp?: () => void;
  inputRef?: (value: any) => void;
  defaultValue?: string;
  value?: string;
  type?: string;
  pattern?: string;
  errorMsg?: React.ReactNode;
  maxLength: number;
  disabled?: boolean;
  className?: string;
  autoFocus: boolean;
  customKeyBoard?: boolean;
  onVirtualKeyboardConfirm?: () => void;
  keyboardHeader?: any;
}

export default class InputVerifyCode extends Component<VerifyCodeProps, any> {
  static defaultProps = {
    defaultValue: '',
    errorMsg: '',
    type: 'number',
    maxLength: 6,
    pattern: "[0-9]*",
    customKeyBoard: false,
    autoFocus: false,
  }

  myRef: any
  maxLength: number
  itemList: any = null

  constructor (props: VerifyCodeProps) {
    super(props)
    this.myRef = null
    this.maxLength = props.maxLength > 0 ? Math.ceil(props.maxLength) : 1
    this.state = {
      value: normalizeValue(props.value || props.defaultValue, this.maxLength),
      focusing: false,
    }
  }

  componentWillReceiveProps (nextProps: VerifyCodeProps) {
    const reciveVal = normalizeValue(nextProps.value, nextProps.maxLength)
    if (nextProps.value !== undefined) {
      this.setState({
        value: reciveVal,
      })
    }
  }

  popInputRef = (el: HTMLInputElement | any) => {
    const { autoFocus, inputRef } = this.props
    this.myRef = el
    if (inputRef) {
      inputRef(el)
    }
    if (autoFocus) {
      this.focus()
    }
  }

  focus = () => {
    if (this.myRef) {
      this.myRef.focus()
    }
  }

  blur = () => {
    if (this.myRef && this.myRef.blur) {
      this.myRef.blur()
    }
  }

  handleChange = (eventVal: any) => {
    const val = typeof eventVal === 'string' ? normalizeValue(eventVal, this.maxLength) : normalizeValue(eventVal.target.value, this.maxLength)
    this.setState({
      value: val,
    })
    this.props.onChange && this.props.onChange(val)
  }

  handleBlur = () => {
    this.setState({
      focusing: false,
    }, () => {
      this.props.onBlur && this.props.onBlur(this.state.value)
      if (this.myRef.onInputBlur) {
        this.myRef.onInputBlur(this.state.value)
      }
    })
  }

  handleKeyUp = (eventVal: any) => {
    this.props.onKeyUp && this.props.onKeyUp(eventVal)
  }

  onInputFocus = () => {
    this.setState({
      focusing: true,
    }, () => {
      this.props.onFocus && this.props.onFocus(this.state.value)
    })
  }

  onClickPanel = () => {
    setTimeout(() => {
      this.focus()
    }, 100)
  }

  getShowVal = () => {
    const value = this.state.value
    const emptyLen = this.maxLength - value.length
    let arr: any = []
    for (let i = 0; i < emptyLen; i++) {
      arr[i] = ''
    }
    return value.split('').concat(arr)
  }

  render () {
    const showVal = this.getShowVal()
    const value = this.state.value
    const {
      errorMsg,
      type,
      maxLength,
      pattern,
      disabled,
      className,
      onBlur,
      customKeyBoard,
      onVirtualKeyboardConfirm,
      keyboardHeader,
      autoFocus,
      ...restProps
    } = this.props
    const { focusing } = this.state

    const cls = classnames('cf_verify_code', className)
    this.itemList = []

    return (
      <div className={cls}>
        <input
          className='cf_verify_input'
          disabled={!!disabled}
          {...restProps}
          ref={this.popInputRef}
          type={type}
          pattern={pattern}
          value={value}
          defaultValue={undefined}
          maxLength={this.maxLength}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.onInputFocus}
          onKeyUp={this.handleKeyUp}
        />
        <div
          className='cf_verify_panel'
          onClick={this.onClickPanel}>
          {
            showVal.map((item: any, index: number) => {
              const itemCls = classnames(
                'cf_verify_panel_item',
                {
                  'cf_verify_cursor': focusing && (value.length === index || (value.length === this.maxLength && index === this.maxLength - 1)),
                }
              )
              return (
                <div
                  className={itemCls}
                  ref={(el) => this.itemList.push(el)}
                  key={index}>
                  {item}
                </div>
              )
            })
          }
        </div>
        { errorMsg ? <div className='cf_input_code_error_tips'>{ errorMsg }</div> : null }
      </div>
    )
  }
}

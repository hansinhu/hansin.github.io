/*
 * @file 搜索建议输入框
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-08-07 11:52:51
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-10-15 15:45:43
 * @Pramas options: [{label, value}]
 * @Pramas value: any
 * @Pramas onChange: (val) => {}
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types'
import { Input } from '@/pages/components'

import openOption from './openOption'
require('./index.less')

class AutoComplete extends React.Component {
  static propTypes = {
    extra: PropTypes.any,
    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    handleSelected: PropTypes.func,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    errorMsg: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    customeOptionHeader: PropTypes.node,
    customeOptionFooter: PropTypes.node,
    optionClassName: PropTypes.string,
  }

  static defaultProps = {
    defaultValue: '',
    errorMsg: '',
    options: [],
    onChange: () => {},
    handleSelected: () => {},
  }

  constructor (props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue,
    }
    this.date_warp = null
    this.selectInput = null
  }

  componentWillReceiveProps (nextProps) {
    const reciveVal = nextProps.value
    if (nextProps.value !== undefined) {
      this.setState({
        value: reciveVal,
      })
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.updateDateWarp)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.updateDateWarp)
  }

  focus = () => {
    const { options, customeOptionHeader, customeOptionFooter, optionClassName, onChange, handleSelected } = this.props
    if (this.date_warp || !options.length) return
    const clintRect = this.selectInput.getBoundingClientRect()
    this.date_warp = openOption({
      ...this.props,
      visible: true,
      value: this.state.value,
      left: clintRect.left + window.pageXOffset,
      top: clintRect.top + clintRect.height + window.pageYOffset,
      width: clintRect.width,
      options,
      customeOptionHeader,
      customeOptionFooter,
      optionClassName,
      handleItemClick: (value) => {
        this.date_warp = null
        onChange(value)
        handleSelected(value)
      },
      onClose: () => {
        this.date_warp = null
      },
    })
  }

  updateDateWarp = () => {
    const { options, customeOptionHeader, customeOptionFooter, optionClassName } = this.props
    if (!this.date_warp) return
    const clintRect = this.selectInput.getBoundingClientRect()
    this.date_warp.update({
      visible: true,
      value: this.state.value,
      left: clintRect.left + window.pageXOffset,
      top: clintRect.top + clintRect.height + window.pageYOffset,
      width: clintRect.width,
      options,
      customeOptionHeader,
      customeOptionFooter,
      optionClassName,
    })
  }

  hiddenDateWarp = () => {
    this.date_warp?.destroy()
  }

  handleKeyUp = (e) => {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(e)
    }
    if (this.date_warp && e.keyCode === 13) {
      this.date_warp.destroy()
    }
  }

  render () {
    const {
      placeholder,
      errorMsg,
      extra,
      style,
      className,
      options,
      customeOptionHeader,
      customeOptionFooter,
      optionClassName,
      handleSelected,
      ...restProps
    } = this.props
    const { value } = this.state
    const inputItemCls = classnames(
      'cf_auto_complete',
      className,
    )
    return (
      <div
        className={inputItemCls}
        ref={el => { this.selectInput = el }}
        onClick={this.focus}
        style={style}
      >
        <Input
          {...restProps}
          placeholder={placeholder}
          value={value}
          errorMsg={errorMsg}
          extra={extra}
          onKeyUp={this.handleKeyUp}
        />
      </div>
    )
  }
}
export default AutoComplete

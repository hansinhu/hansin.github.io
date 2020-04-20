/*
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-08-07 11:52:51
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-09-03 19:06:02
 * @Pramas options: [{label, value}]
 * @Pramas value: any
 * @Pramas onChange: (val) => {}
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types'
import { Icon } from '@/pages/components'

import openSelect from './openSelect'
require('./index.less')

class Select extends React.Component {
  static propTypes = {
    label: PropTypes.any,
    extra: PropTypes.any,
    onChange: PropTypes.func,
    inputRef: PropTypes.func,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    togglePlaceholder: PropTypes.bool,
    disabled: PropTypes.bool,
    errorMsg: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    autoFocus: PropTypes.bool,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }

  static defaultProps = {
    togglePlaceholder: false,
    defaultValue: '',
    errorMsg: '',
    options: [],
  }

  constructor (props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue,
      show_pop: false,
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

  focus = () => {
    if (this.date_warp || !this.props.options.length) return
    const clintRect = this.selectInput.getBoundingClientRect()
    this.setState({
      show_pop: true,
    })
    this.date_warp = openSelect({
      visible: true,
      value: this.state.value,
      left: clintRect.left + window.pageXOffset,
      top: clintRect.top + clintRect.height + window.pageYOffset,
      width: clintRect.width,
      options: this.props.options,
      handleSelected: (value) => {
        this.date_warp = null
        this.setState({
          value: value,
          show_pop: false,
        })
        this.props.onChange && this.props.onChange(value)
      },
      onClose: () => {
        this.date_warp = null
        this.setState({
          show_pop: false,
        })
      },
    })
  }

  getShowValue = (val) => {
    if (!this.props.options.length) return ''
    return this.props.options.find(item => item.value === val)?.label
  }

  render () {
    const {
      placeholder,
      togglePlaceholder,
      errorMsg,
      label,
      extra,
      style,
      disabled,
      className,
    } = this.props
    const { value, show_pop } = this.state
    const inputItemCls = classnames(
      'cf_select',
      {
        'cf_select_error': errorMsg,
        'cf_select_disabled': disabled,
        'cf_select_toggle': togglePlaceholder,
      },
      className,
    )
    const placeholderCls = classnames(
      'cf_select_placeholder',
      {
        'cf_select_top': this.getShowValue(value),
      },
    )
    return (
      <div className={inputItemCls} ref={el => { this.selectInput = el }} onClick={this.focus} style={style}>
        <div className='cf_select_warp'>
          {
            label ? <div className='cf_select_label'>{label}</div> : null
          }
          <div className='cf_select_control'>
            <div className='cf_select_inner'>{this.getShowValue(value)}</div>
            {
              togglePlaceholder || !this.getShowValue(value)
                ? <div className={placeholderCls}>{placeholder}</div>
                : null
            }
          </div>
          <div
            className={classnames('cf_select_extra', {
              'cf_select_extra_active': show_pop,
            })}
          ><Icon name='xiala' />{extra}</div>
        </div>
        {
          errorMsg ? <div className='cf_select_error_tips'>{errorMsg}</div> : null
        }
      </div>
    )
  }
}
export default Select

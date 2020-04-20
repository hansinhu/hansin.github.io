/*
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-08-07 11:52:51
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-09-03 19:05:27
 * @Pramas options: [{label, value}]
 * @Pramas value: any
 * @Pramas onChange: ({ date, year, month }) => {}
 */

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types'
import { Icon } from '@/pages/components'

import openDate from './openDate'
require('./index.less')

class DateSelect extends React.Component {
  static propTypes = {
    label: PropTypes.any,
    extra: PropTypes.any,
    onChange: PropTypes.func,
    inputRef: PropTypes.func,
    defaultValue: PropTypes.any,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    togglePlaceholder: PropTypes.bool,
    type: PropTypes.string,
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
    errorMsg: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    autoFocus: PropTypes.bool,
    dateFormate: PropTypes.func,
  }

  static defaultProps = {
    togglePlaceholder: false,
    errorMsg: '',
    dateFormate: (date) => {
      if (!date) return ''
      const month = `${date.getMonth() + 1}`.padStart(2, '0')
      return `${month}/${date.getFullYear()}`
    },
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
    if (nextProps.value !== undefined) {
      this.setState({
        value: nextProps.value,
      })
    }
  }

  focus = () => {
    if (this.date_warp) return
    const clintRect = this.selectInput.getBoundingClientRect()
    this.date_warp = openDate({
      visible: true,
      left: clintRect.left + window.pageXOffset,
      top: clintRect.top + clintRect.height + window.pageYOffset,
      date: this.state.value,
      handleSelected: (obj) => {
        this.date_warp = null
        this.setState({
          value: obj.date,
        })
        obj.formateDate = this.props.dateFormate(obj.date)
        this.props.onChange && this.props.onChange(obj)
      },
      onClose: () => {
        this.date_warp = null
      },
    })
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
      ...restProps
    } = this.props
    const { value } = this.state
    const inputItemCls = classnames(
      'cf_date_select',
      {
        'cf_date_select_error': errorMsg,
        'cf_date_select_disabled': disabled,
        'cf_date_select_toggle': togglePlaceholder,
      },
      className,
    )
    const placeholderCls = classnames(
      'cf_date_select_placeholder',
      {
        'cf_date_select_top': value,
      },
    )
    return (
      <div className={inputItemCls} ref={el => { this.selectInput = el }} onClick={this.focus}>
        <div className='cf_date_select_warp'>
          {
            label ? <div className='cf_date_select_label'>{label}</div> : null
          }
          <div className='cf_date_select_control'>
            <div className='cf_date_select_inner'>{this.props.dateFormate(value)}</div>
            {
              togglePlaceholder ? <div className={placeholderCls}>{placeholder}</div> : null
            }
          </div>
          <div className='cf_date_select_extra'><Icon name='date' />{extra}</div>
        </div>
        {
          errorMsg ? <div className='cf_date_select_error_tips'>{errorMsg}</div> : null
        }
      </div>
    )
  }
}
export default DateSelect

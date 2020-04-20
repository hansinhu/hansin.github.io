/*
 * @file 搜索建议输入框打开弹框
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-10-15 15:47:11
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-10-15 15:47:40
 */

import React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames'
import PropTypes from 'prop-types'
require('./index.less')

class AutoCompleteDialog extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    handleItemClick: PropTypes.func,
    close: PropTypes.func,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    optionClassName: PropTypes.string,
    customeOptionHeader: PropTypes.node,
    customeOptionFooter: PropTypes.node,
  }

  static defaultProps = {
    handleItemClick: () => {},
    close: () => {},
    value: '',
    options: [],
  }

  componentDidMount () {
    document.addEventListener('click', this.hidenDate, false)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.hidenDate)
  }

  hidenDate = (e) => {
    this.props.close()
  }

  handleItemClick = (item) => {
    if (item.disabled) return
    const val = typeof item === 'string' ? item : item.value
    this.props.handleItemClick(val)
    this.props.close()
  }

  handlePopClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  render () {
    const { options, value, width, optionClassName, customeOptionHeader, customeOptionFooter } = this.props
    return <div
      className={classNames('cf_auto_pop_container', optionClassName)}
      onClick={this.handlePopClick}
      style={{ left: this.props.left, top: this.props.top }}
    >
      <div className='cf_auto_pop' style={{ width: `${width}px` }}>
        <div className='cf_auto_pop_warp'>
          <div className='cf_auto_pop_panel' ref={(el) => { this.warpEl = el }}>
            {
              customeOptionHeader || null
            }
            <div className='cf_auto_pop_body'>
              {
                options.map((op, i) => {
                  return <div key={i}
                    onClick={() => this.handleItemClick(op)}
                    className={classNames(
                      'cf_auto_pop_item',
                      {
                        'cf_auto_pop_item_active': value === (typeof op === 'string' ? op : op.value),
                        'cf_auto_pop_item_disabled': op.disabled,
                      }
                    )}
                  >
                    {
                      typeof op === 'string' ? op : op.label
                    }
                  </div>
                })
              }
            </div>
            {
              customeOptionFooter || null
            }
          </div>
        </div>
      </div>
    </div>
  }
}

function openOption (config) {
  if (!document) {
    return;
  }
  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.top = '2px'
  div.style.left = '0px'
  div.style.width = '100%'
  document.body.appendChild(div)

  let currentConfig = { ...config, close }

  function close (...args) {
    currentConfig = {
      ...currentConfig,
    }
    render(currentConfig)
    config.onClose && config.onClose(...args)
    setTimeout(() => {
      destroy(...args)
    }, 100)
  }

  function update (newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  function destroy (...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }
    const triggerCancel = args && args.length && args.some(param => param && param.triggerCancel);
    if (config.onClose && triggerCancel) {
      config.onClose(...args)
    }
  }

  function render (props) {
    ReactDOM.render(<AutoCompleteDialog {...props}/>, div)
  }

  render(currentConfig)
  return {
    destroy: close,
    update,
  }
}

export default openOption;

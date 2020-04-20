import React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames'
import PropTypes from 'prop-types'
require('./index.less')

class SelectDialog extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    left: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number,
    handleSelected: PropTypes.func,
    close: PropTypes.func,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }

  static defaultProps = {
    handleSelected: () => {},
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
    this.props.handleSelected(typeof item === 'string' ? item : item.value)
    this.props.close()
  }

  handlePopClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  render () {
    const { options, value, width } = this.props
    return <div
      className='cf_select_pop_container'
      onClick={this.handlePopClick}
      style={{ left: this.props.left, top: this.props.top }}
    >
      <div className='cf_select_pop' style={{ width: `${width}px` }}>
        <div className='cf_select_pop_warp'>
          <div className='cf_select_pop_panel' ref={(el) => { this.warpEl = el }}>
            <div className='cf_select_pop_body'>
              {
                options.map((op, i) => {
                  return <div key={i}
                    onClick={() => this.handleItemClick(op)}
                    className={classNames(
                      'cf_select_pop_item',
                      {
                        'cf_select_pop_item_active': value === (typeof op === 'string' ? op : op.value),
                        'cf_select_pop_item_disabled': op.disabled,
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
          </div>
        </div>
      </div>
    </div>
  }
}

function openSelect (config) {
  if (!document) {
    return;
  }
  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.top = '0px'
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
    ReactDOM.render(<SelectDialog {...props}/>, div)
  }

  render(currentConfig)
  return {
    destroy: close,
    update,
  }
}

export default openSelect;

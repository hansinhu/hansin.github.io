import React from 'react';
import * as ReactDOM from 'react-dom';
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from '@/pages/components'
require('./index.less')

class PreviewDialog extends React.Component {
  static propTypes = {
    date: PropTypes.any,
    left: PropTypes.number,
    top: PropTypes.number,
    handleSelected: PropTypes.func,
    close: PropTypes.func,
  }

  static defaultProps = {
    handleSelected: () => {},
    close: () => {},
  }

  constructor (props) {
    super(props)
    this.willHidden = false
    this.state = {
      selectYear: props.date ? props.date.getFullYear() : null,
      selectMonth: props.date ? props.date.getMonth() : null,
      showMonthPanel: false,
      minYear: new Date().getFullYear(),
      maxYear: new Date().getFullYear() + 20,
    }
  }

  componentDidMount () {
    document.addEventListener('click', this.hidenDate)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.hidenDate)
  }

  hidenDate = (e) => {
    this.props.close()
  }

  getYearsList = () => {
    const currentYear = new Date().getFullYear()
    let arr = []
    for (let i = 0; i < 20; i++) {
      arr.push(currentYear + i)
    }
    return arr
  }

  getMonthList = () => {
    const currentMonth = new Date().getMonth()
    let arr = []
    for (let i = 0; i < 12; i++) {
      arr.push({
        disabled: this.state.selectYear === this.state.minYear && i < currentMonth,
        month: i,
      })
    }
    return arr
  }

  handleYearItemClick = (year) => {
    this.willHidden = false
    this.setState({
      selectYear: year,
      selectMonth: null,
      showMonthPanel: true,
    })
  }

  handleMonthItemClick = (item) => {
    this.willHidden = false
    if (item.disabled) return
    const { selectYear } = this.state
    this.setState({
      selectMonth: item.month,
    })
    const month = `${item.month}`.padStart(2, '0')
    const date = new Date(`${selectYear}`, month, '01')
    this.props.handleSelected({
      date,
    })
    this.props.close()
  }

  reduceYear = () => {
    const { selectYear, minYear } = this.state
    this.setState({
      selectYear: selectYear <= minYear ? minYear : selectYear - 1,
    })
  }

  addYear = () => {
    const { selectYear, maxYear } = this.state
    this.setState({
      selectYear: selectYear >= maxYear ? maxYear : selectYear + 1,
    })
  }

  handlePopClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  render () {
    const { selectYear, showMonthPanel, selectMonth, minYear, maxYear } = this.state
    return <div
      className='cf_date_pop'
      onClick={this.handlePopClick}
      style={{ left: this.props.left, top: this.props.top }}
    >
      <div className='cf_date'>
        <div className='cf_date_warp'>
          <div className='cf_date_panel' ref={(el) => { this.warpEl = el }}>
            <div className='cf_date_header'>
              {
                showMonthPanel
                  ? <div
                    className={
                      classNames('cf_date_header_oprate', { 'cf_date_header_oprate_disabled': selectYear <= minYear })
                    }
                    onClick={this.reduceYear}
                  ><Icon name='pre_item' /></div>
                  : null
              }
              <div className='cf_date_header_val'>{selectYear || 'Select'}</div>
              {
                showMonthPanel
                  ? <div
                    className={
                      classNames('cf_date_header_oprate', { 'cf_date_header_oprate_disabled': selectYear >= maxYear })
                    }
                    onClick={this.addYear}
                  ><Icon name='next_item' /></div>
                  : null
              }
            </div>
            <div className='cf_date_body'>
              {
                showMonthPanel
                  ? <div className='cf_date_month'>
                    {
                      this.getMonthList().map(item => {
                        return <div
                          key={item.month}
                          className={classNames(
                            'cf_date_month_item',
                            {
                              'cf_date_month_active': item.month === selectMonth,
                              'cf_date_month_disabled': item.disabled,
                            })}
                          onClick={() => this.handleMonthItemClick(item)}
                        >{`${item.month + 1}`.padStart(2, '0')}</div>
                      })
                    }
                  </div>
                  : <div className='cf_date_year'>
                    {
                      this.getYearsList().map(year => {
                        return <div
                          key={year}
                          className={classNames('cf_date_year_item', { 'cf_date_year_active': year === selectYear })}
                          onClick={() => {
                            this.handleYearItemClick(year)
                          }}
                        >{year}</div>
                      })
                    }
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

function openDate (config) {
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
    ReactDOM.render(<PreviewDialog {...props}/>, div)
  }

  render(currentConfig)
  return {
    destroy: close,
    update,
  }
}

export default openDate;

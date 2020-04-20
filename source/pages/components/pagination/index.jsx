import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from '@/pages/components'

require('./index.less')

class Pagination extends React.Component {
  static propTypes = {
    current: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: () => {},
  }

  itemClick = (page) => {
    this.props.onChange(page)
  }

  preClick = () => {
    const { current, onChange } = this.props
    if (current === 1) return
    onChange(current - 1)
  }

  nextClick = () => {
    const { current, total = 0, pageSize = 1, onChange } = this.props
    const max = Math.ceil(total / pageSize)
    if (current === max) return
    onChange(current + 1)
  }

  leftMoreClick = () => {
    const { current, onChange } = this.props
    onChange(current - 2)
  }

  rightMoreClick = () => {
    const { current, onChange } = this.props
    onChange(current + 2)
  }

  render () {
    const { current, total = 0, pageSize = 1 } = this.props
    const max = Math.ceil(total / pageSize)
    const totalPages = Array.from({ length: max }).map((_, i) => i + 1)
    let currentPages = []
    if (max < 6) {
      currentPages = totalPages.slice(0)
    } else if (current === 1) {
      currentPages = totalPages.slice(0, 3)
    } else if (current === max) {
      currentPages = totalPages.slice(max - 2, max)
    } else {
      currentPages = totalPages.slice(current - 2, current + 1)
    }
    const leftMore = current > 3
    const rightMore = current < max - 3
    const showMin = !currentPages.includes(1)
    const showMax = !currentPages.includes(max)

    if (total <= 0) {
      return null
    }

    return <ul className='cf_pagination'>
      <li
        onClick={this.preClick}
        className={classNames(`cf_pagination-prev cf_pagination-item`, {
          'cf_pagination-disabled': current === 1,
        })}
      >
        <Icon name='fanhui1' />
      </li>
      {
        showMin ? <li
          onClick={ () => { this.itemClick(1) } }
          className='cf_pagination-item'
        >{1}</li> : null
      }
      {
        leftMore ? <li onClick={this.leftMoreClick} className='cf_pagination-more'>...</li> : null
      }
      {
        currentPages.map((page, i) => {
          return <li
            key={i}
            className={classNames('cf_pagination-item', { 'cf_pagination-item-active': current === page })}
            onClick={ () => { this.itemClick(page) } }
          >{page}</li>
        })
      }
      {
        rightMore ? <li onClick={this.rightMoreClick} className='cf_pagination-more'>...</li> : null
      }
      {
        showMax ? <li
          onClick={ () => { this.itemClick(max) } }
          className='cf_pagination-item'
        >{max}</li> : null
      }
      <li
        onClick={this.nextClick}
        className={classNames(`cf_pagination-next cf_pagination-item`, {
          'cf_pagination-disabled': max === current,
        })}>
        <Icon name='gengduo1' />
      </li>
    </ul>
  }
}
export default Pagination

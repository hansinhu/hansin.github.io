import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class Icon extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    style: {},
    className: '',
  }

  render () {
    const { name, style, className, onClick } = this.props
    return (
      <i onClick={() => { onClick?.() }} className={`iconfont icon-${name} ${className}`} style={style}></i>
    )
  }
}

export default Icon

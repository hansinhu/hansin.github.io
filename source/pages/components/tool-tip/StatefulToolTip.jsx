import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import ToolTip from './ToolTip'

export default class StatefulToolTip extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    parent: PropTypes.any,
    children: PropTypes.any,
    targetType: PropTypes.oneOf(['hover', 'click']),
  }

  static defaultProps = {
    className: '',
    targetType: 'hover',
  }

  constructor (props) {
    super(props)
    this.state = {
      tooltipVisible: false,
      handleVisieble: props.targetType !== 'click',
    }
  }

  onMouseEnter = () => {
    this.setState({ tooltipVisible: true })
  }

  onMouseLeave = () => {
    this.setState({ tooltipVisible: false })
  }

  handleHidden = () => {
    this.setState({ handleVisieble: false }, () => {
      if (this.props.targetType !== 'click') {
        setTimeout(() => {
          this.setState({ handleVisieble: true })
        }, 300)
      }
    })
  }

  handleVisible = () => {
    this.setState({ handleVisieble: true })
  }

  onHidden = () => {
    if (this.props.targetType === 'click') {
      this.setState({ handleVisieble: false })
    }
  }

  render () {
    const { children, className, parent, ...props } = this.props

    return (
      <Fragment>
        <span className={ className }
          onMouseEnter={ this.onMouseEnter }
          onMouseLeave={ this.onMouseLeave }
          ref={ p => { this.parent = p } }
          key="parent">{ this.props.parent }</span>
        {
          this.parent && this.state.handleVisieble
            ? <ToolTip
              { ...props }
              active={ this.state.tooltipVisible }
              parent={ this.parent }
              onHidden={ this.onHidden }
              key="tooltip"
            >{ this.props.children }</ToolTip>
            : null
        }
      </Fragment>
    )
  }
}

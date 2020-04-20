import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ClipboardJS from 'clipboard'

export default class Copy extends Component {
  static propTypes = {
    text: PropTypes.string,
    children: PropTypes.node,
    success: PropTypes.func,
    fail: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
  }

  static defaultProps = {
    text: '',
  }

  constructor () {
    super()
    this.copy_node = null
    this.state = {}
  }

  componentDidMount () {
    const { success, fail } = this.props
    this.clipboard = new ClipboardJS(this.copy_node);
    this.clipboard.on('success', (e) => {
      success?.(e)
      e.clearSelection();
    });

    this.clipboard.on('error', (e) => {
      fail?.(e)
    });
  }

  render () {
    const { text, children, style, className } = this.props
    return (
      <div
        ref={(el) => { this.copy_node = el }}
        style={style}
        className={`needsclick ${className}`}
        data-clipboard-text={text}>
        { children }
      </div>
    )
  }
}

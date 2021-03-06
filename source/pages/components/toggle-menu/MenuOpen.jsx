import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Card from './Card'

const portalNodes = {}

export default class MenuOpen extends React.Component {
  static propTypes = {
    parent: PropTypes.any,
    active: PropTypes.bool,
    group: PropTypes.string,
    tooltipTimeout: PropTypes.number,
  }

  static defaultProps = {
    active: false,
    group: 'main',
    tooltipTimeout: 200,
  }

  createPortal () {
    portalNodes[this.props.group] = {
      node: document.createElement('div'),
      timeout: false,
    }
    portalNodes[this.props.group].node.className = 'ToolTipPortal'
    document.body.appendChild(portalNodes[this.props.group].node)
  }

  renderPortal (props) {
    if (!portalNodes[this.props.group]) {
      this.createPortal()
    }
    let { parent, ...other } = props
    if (!parent) return
    let parentEl = typeof parent === 'string' ? document.querySelector(parent) : parent
    ReactDOM.render(<Card parentEl={parentEl} {...other}/>, portalNodes[this.props.group].node)
  }

  componentDidMount () {
    if (!this.props.active) {
      return
    }

    this.renderPortal(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if ((!portalNodes[this.props.group] && !nextProps.active) ||
      (!this.props.active && !nextProps.active)) {
      return
    }

    let props = { ...nextProps }
    let newProps = { ...nextProps }

    if (portalNodes[this.props.group] && portalNodes[this.props.group].timeout) {
      clearTimeout(portalNodes[this.props.group].timeout)
    }

    if (this.props.active && !props.active) {
      newProps.active = true
      portalNodes[this.props.group].timeout = setTimeout(() => {
        props.active = false
        this.renderPortal(props)
      }, this.props.tooltipTimeout)
    }

    this.renderPortal(newProps)
  }

  componentWillUnmount () {
    if (portalNodes[this.props.group]) {
      ReactDOM.unmountComponentAtNode(portalNodes[this.props.group].node)
      clearTimeout(portalNodes[this.props.group].timeout)

      try {
        document.body.removeChild(portalNodes[this.props.group].node)
      } catch (e) {}

      portalNodes[this.props.group] = null
    }
  }

  render () {
    return null
  }
}

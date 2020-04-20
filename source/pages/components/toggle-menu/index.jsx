import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MenuOpen from './MenuOpen'
require('./index.less')


export default class ToggleMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      moreMenuActive: false,
    }
    this.parentEl = null
  }

  static propTypes = {
    menuNode: PropTypes.node,
    menuItems: PropTypes.array.isRequired,
    customItemNode: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    menuItemClick: PropTypes.func,
    currentKey: PropTypes.string,
  }

  static defaultProps = {
    menuItems: [],
    menuItemClick: () => {},
  }

  render () {
    const { moreMenuActive } = this.state
    const { menuNode, menuItems, customItemNode, menuItemClick, currentKey, className, style, ...restProps } = this.props
    const warpMenu = React.cloneElement(
      this.props.menuNode,
      {
        onMouseOver: () => { this.setState({ moreMenuActive: true }) },
        onMouseLeave: () => { this.setState({ moreMenuActive: false }) },
        ref: (el) => { this.parentEl = el },
      },
    )
    return <>
    { warpMenu }
    <MenuOpen
      {...restProps}
      active={moreMenuActive}
      parent={this.parentEl}
    >
      <div className={classNames('cf_toggle_menu', className)} style={style}>
        <ul>
          {
            menuItems.map((item, i) => {
              return <li
                onClick={() => {
                  menuItemClick(item)
                  this.setState({ moreMenuActive: false })
                }}
                className={classNames({ 'cf_toggle_item_active': currentKey === item.key })}
                key={item.key || i}>
                {
                  customItemNode ? customItemNode(item) : item.label
                }
              </li>
            })
          }
        </ul>
      </div>
    </MenuOpen>
    </>
  }
}

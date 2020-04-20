import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
require('./index.less')

class Tabs extends React.Component {
  static propTypes = {
    tabs: PropTypes.array,
    children: PropTypes.node,
    changeTabIndex: PropTypes.func,
    customTabBar: PropTypes.func,
    activeIndex: PropTypes.number,
    className: PropTypes.string,
  }
  static defaultProps = {
    tabs: [],
    changeTabIndex: () => {},
    activeIndex: 0,
  }
  constructor (props) {
    super(props)
    this.state = {
      currentIndex: props.activeIndex,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeIndex !== this.props.activeIndex && nextProps.activeIndex !== this.state.currentIndex) {
      this.setState({
        currentIndex: nextProps.activeIndex,
      })
    }
  }

  changeTabItem = (tab, i) => {
    this.setState({
      currentIndex: i,
    })
    this.props.changeTabIndex({ tabItem: tab, index: i })
  }

  render () {
    const { customTabBar } = this.props
    const array_child = React.Children.toArray(this.props.children)
    return <div className={classNames('cf-tabs', this.props.className)}>
      <div className='cf-tabs-bar'>
        {
          this.props.tabs.map((tab, i) => {
            return <div
              key={i}
              onClick={() => this.changeTabItem(tab, i)}
              className={
                classNames('cf-tabs-bar-item', {
                  'cf-tabs-bar-active': i === this.state.currentIndex,
                })
              }
            >
              <div className='cf-tabs-bar-inner'>{
                customTabBar ? customTabBar(tab) : tab.label
              }</div>
            </div>
          })
        }
      </div>
      <div className='cf-tabs-content'>
        {
          array_child.map((child, i) => {
            return <div
              className={
                classNames('cf-tabs-content-item', {
                  'cf-tabs-content-active': i === this.state.currentIndex,
                })
              }
              key={i}
            >{child}</div>
          })
        }
      </div>
    </div>
  }
}
export default Tabs

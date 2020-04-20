import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Icon } from '@/pages/components';
require('./index.less')

export interface CollapseProps {
  title: Node;
  titlePosition: 'top' | 'bottom' | '';
  onChange: (active: boolean) => void;
  isActive: boolean;
  showArrow: boolean;
  className: string;
  style: CSSProperties;
}

class Collapse extends React.Component<CollapseProps, any> {
  static defaultProps = {
    title: '', // 字符串 或 element
    titlePosition: 'top', // title的位置【top, bottom】
    style: {}, // wrap的style
    isActive: false, // 默认展开【true, false】
    showArrow: true, // 箭头【true, false】
  }

  height = 0
  disable = false
  $panelCon: HTMLDivElement | null = null;
  initHidden: boolean

  constructor (props: CollapseProps) {
    super(props)
    this.initHidden = !props.isActive,
    this.state = {
      isActive: props.isActive,
      contentStyle: {
        display: props.isActive ? 'block' : 'none',
      },
    }
  }

  componentWillReceiveProps(nextProps: CollapseProps) {
    if (
      nextProps.isActive !== this.props.isActive
      && nextProps.isActive !== this.state.isActive
      && !this.disable
    ) {
      this.handleItemClick()
    }
  }

  componentDidMount () {
    const node = this.$panelCon
    if (!node) return
    this.height = node.offsetHeight;
    if (!this.props.isActive) {
      node.style.display = 'none'
    }
  }

  handleItemClick = () => {
    if (this.disable || !this.$panelCon) return
    this.disable = true
    const node = this.$panelCon
    node.style.display = 'block'
    node.style.overflow = 'hidden'
    // start
    if (this.state.isActive) {
      node.style.height = `${this.height}px`
    } else {
      node.style.height = '0';
    }
    // animation
    const active = !this.state.isActive
    setTimeout(() => {
      node.style.height = `${active ? this.height : 0}px`
    }, 10)
    // end
    setTimeout(() => {
      node.style.display = active ? 'block' : 'none'
      node.style.height = ''
      node.style.overflow = ''
      this.disable = false
    }, 300)
    this.props.onChange && this.props.onChange(active)
    this.setState({ isActive: active })
  }

  titleContent = () => {
    const { title, showArrow } = this.props
    return (
      <div
        className='cf_collapse_title'
        onClick={this.handleItemClick}
      >
        <div className='cf_collapse_title_inner'>
        {
          title
        }
        </div>
        {
          showArrow
            ? <span className='cf_collapse_icon_wrap'>
              <Icon
                size='xs'
                className='cf_collapse_icon'
                name='down'
              />
            </span>
            : null
        }
      </div>
    )
  }

  render () {
    const { className, style, titlePosition, children } = this.props
    const { isActive } = this.state
    const coCls = classnames(
      'cf_collapse',
      `cf_collapse_${titlePosition}`,
      {
        'cf_collapse_active': isActive,
      },
      className,
    )
    return (
      <div className={coCls} style={style}>
        { titlePosition === 'bottom' ? null : this.titleContent() }
        <div
          ref={el => (this.$panelCon = el)}
          className='cf_collapse_content'
        >
          { children }
        </div>
        { titlePosition === 'bottom' ? this.titleContent() : null }
      </div>
    )
  }
}
export default Collapse

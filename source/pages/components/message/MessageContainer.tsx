import React from 'react';
import ReactDOM from 'react-dom'
import classnames from 'classnames';

export interface MessageContainerProps {
  className?: string;
  visible: boolean;
}

class MessageContainer extends React.Component<MessageContainerProps> {

  static defaultProps = {
    styles: {},
    visible: false,
    className: '',
  }
  el: any;

  componentWillMount () {
    if (!document) {
      return;
    }
    const { className } = this.props
    const wrapCls = classnames('cf_message', `${className}`)
    // 如果是modal_toast复用原来的el，否则新生成el
    this.el = document.createElement('div')
    this.el.setAttribute('class', wrapCls)
    document.body.appendChild(this.el)
  }

  componentWillUnmount () {
    this.el && document.body.removeChild(this.el)
  }

  render () {
    const { visible } = this.props
    if (visible) {
      setTimeout(() => {
        this.el.classList.add('cf_message_open')
      }, 10)
    } else {
      this.el.classList.remove('cf_message_open')
    }

    return ReactDOM.createPortal(
      this.props.children, this.el,
    )
  }
}

export default MessageContainer

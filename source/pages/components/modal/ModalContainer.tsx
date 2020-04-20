import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

export interface ModalContainerProps {
  className?: string;
  visible: boolean;
  id?: string;
}

class ModalContainer extends React.Component<ModalContainerProps> {

  static defaultProps = {
    visible: false,
  }
  el: any;

  componentWillMount () {
    if (!document) {
      return;
    }
    const { className, id } = this.props
    // 如果是modal_toast复用原来的el，否则新生成el
    this.el = document.createElement('div')
    const cls = classNames('cf_modal', className)
    this.el.setAttribute('class', cls)
    if (id) {
      this.el.setAttribute('id', id)
    }
    document.body.appendChild(this.el)
  }

  componentWillUnmount () {
    this.el && document.body.removeChild(this.el)
    document.body.style.overflow = ''
  }

  render () {
    const { visible, children } = this.props
    if (visible) {
      setTimeout(() => {
        this.el.classList.add('cf_modal_open')
        document.body.style.overflow = 'hidden'
      }, 10)
    } else {
      this.el.classList.remove('cf_modal_open')
      document.body.style.overflow = ''
    }

    return ReactDOM.createPortal(
      children, this.el,
    )
  }
}

export default ModalContainer

import React from 'react';
import * as ReactDOM from 'react-dom';
import classnames from 'classnames';
import Icon from '@/pages/components/Icon';
require('./style/index.less')

import MessageContainer from './MessageContainer'

export interface MessageModalProps {
  visible: boolean;
  duration: number;
  type: 'success' | 'info' | 'error';
  content?: React.ReactNode;
  close: () => void;
  className?: string;
}

class MessageModal extends React.Component<any, MessageModalProps> {

  static defaultProps = {
    duration: 2000,
    type: 'info',
  }
  timer: any

  componentDidMount() {
    const { close, duration, type } = this.props
    this.timer = setTimeout(()=> {
      close()
    }, duration)
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
  }

  getIcon = (type: string) => {
    let icon: any = null
    switch (type) {
      case 'success':
        icon = <Icon name="check" size="lg" style={{ color: '#00a600' }}/>
        break
      case 'error':
        icon = <Icon name="notice" size='lg' style={{ color: '#F15440' }}/>
        break
      case 'info':
        icon = icon = <Icon name="checked" size='lg' style={{ color: '#F15440' }}/>
        break
      default:
        icon = null
    }
    return icon
  }

  render () {
    const { visible, content, type, className } = this.props
    const toastCls = classnames('cf_message', className)
    return (
      <MessageContainer visible={visible} className={toastCls}>
        <div className={classnames('cf_message_content', `cf_message_${type}`)}>
          {this.getIcon(type)}
          <div className='cf_message_text'>{ content }</div>
        </div>
      </MessageContainer>
    )
  }
}

let toastList: any = []

function toast (config: any) {
  if (!document) {
    return;
  }
  const div = document.createElement('div')
  document.body.appendChild(div)

  let currentConfig = { ...config, close, visible: true }

  function close (...args: any[]) {
    currentConfig = {
      ...currentConfig,
      visible: false,
    }
    render(currentConfig)
    config.onHidden && config.onHidden()
    setTimeout(() => {
      destroy(...args)
    }, 300)
  }

  function update (newConfig: any) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  function destroy (...args: any[]) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }
    const triggerHidden = args && args.length && args.some(param => param && param.triggerHidden);
    if (config.onHidden && triggerHidden) {
      config.onHidden(...args)
    }
  }

  function render (props: Object) {
    ReactDOM.render(<MessageModal {...props}/>, div)
  }

  render(currentConfig)
  const toastItem = {
    destroy: close,
    update,
  }
  toastList.push(toastItem)
  return toastItem
}

export default {
  success: (content: React.ReactNode, duration?: number, onHidden?: () => void) => {
    return toast({
      type: 'success',
      content,
      duration,
      onHidden,
    })
  },
  error: (content: React.ReactNode, duration?: number, onHidden?: () => void) => {
    return toast({
      type: 'error',
      content,
      duration,
      onHidden,
    })
  },
  info: (content: React.ReactNode, duration?: number, onHidden?: () => void) => {
    return toast({
      type: 'info',
      content,
      duration,
      onHidden,
    })
  },
  hiddenAll: () => {
    if (toastList && toastList.length) {
      toastList.forEach((item: { destroy: () => void }) => {
        item.destroy();
      })
    }
    toastList = []
  },
}

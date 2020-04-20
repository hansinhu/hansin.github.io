import React from 'react';
import * as ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Icon } from '@/pages/components'

import ModalContainer from './ModalContainer'

export interface ConfirmModalProps {
  visible: boolean;
  content: Node;
  close: () => void;
  ok: () => void;
  okText: string;
  cancelText: string;
  className: string;
  maskClick: () => void;
  shouldHandleDestroy?: boolean;
}
class ConfirmModal extends React.Component<any, ConfirmModalProps> {

  static defaultProps = {
    cancelText: 'Cancel',
    okText: 'Ok',
  }

  wrapClick = () => {
    if (this.props.maskClick) {
      this.props.maskClick()
    }
  }

  contentClick = (e: any) => {
    e.stopPropagation()
  }

  render () {
    const { visible, content, close, cancelText, ok, okText, className } = this.props
    const confirmCls = classnames('cf_confirm', className)
    return (
      <ModalContainer visible={visible} className={confirmCls}>
        <div>
          <div className='cf_modal_mask' />
          <div className='cf_confirm_wrap' onClick={this.wrapClick}>
            <div className='cf_confirm_container' onClick={(e) => this.contentClick(e)}>
              <div className='cf_confirm_content'>
                <div className='cf_confirm_icon'><Icon name='notice' style={{ fontSize: '32px' }} /></div>
                <div>{ content }</div>
              </div>
              <div className='cf_confirm_btn'>
                {
                  !cancelText
                    ? null
                    : <button
                      onClick={close}
                      className={classnames('cf_confirm_cancel', { 'cf_confirm_btn_single': !cancelText })}
                    >{cancelText}</button>
                }
                <button
                  onClick={ok}
                  className={classnames('cf_confirm_ok', { 'cf_confirm_btn_single': !cancelText })}
                >{okText || 'Ok'}</button>
              </div>
            </div>
          </div>
        </div>
      </ModalContainer>
    )
  }
}

function confirm (config: any) {
  if (!document) {
    return {
      destroy: () => {},
      update: () => {},
    }
  }
  const div = document.createElement('div')
  document.body.appendChild(div)

  window.addEventListener('popstate', destroy)

  let currentConfig = { ...config, ok, close, visible: true }

  function ok (...args: any[]) {
    config.onOk && config.onOk()
    if (!currentConfig.shouldHandleDestroy) {
      closeConfirm(...args)
    }
  }

  function close (...args: any[]) {
    config.onCancel && config.onCancel()
    if (!currentConfig.shouldHandleDestroy) {
      closeConfirm(...args)
    }
  }

  function closeConfirm (...args: any[]) {
    currentConfig = {
      ...currentConfig,
      visible: false,
    }
    render(currentConfig)
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
    window.removeEventListener('popstate', destroy)
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }
    const triggerCancel = args && args.length && args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args)
    }
  }

  function render (props: Object) {
    ReactDOM.render(<ConfirmModal {...props}/>, div)
  }

  render(currentConfig)
  return {
    destroy: closeConfirm,
    update,
  }
}

export default confirm

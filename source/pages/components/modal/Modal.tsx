import React from 'react'

import Icon from '@/pages/components/Icon';
import Button from '../button/index';

import ModalContainer from './ModalContainer';
import CustomModal from './Custom';

export abstract class ModalComponent<P, S> extends React.Component<P, S> {
  static Confirm: (config: any) => { destroy: (...args: any[]) => void; update: (newConfig: any) => void; };
}

export interface ModalProps {
  visible: boolean;
  className: string;
  title: React.ReactNode;
  onCancel: () => void;
  onOk: () => void;
  okText: string;
  showCloseIcon: boolean;
  maskClick: () => void;
  maskClickClose: boolean;
  preMunt: boolean;
  btnSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xlg';
  showCallBack?: () => void;
}

class BaseModal extends ModalComponent<ModalProps, any> {

  static CustomModal = CustomModal

  static defaultProps = {
    className: '',
    title: '',
    okText: '',
    showCloseIcon: false,
    preMunt: false,
    btnSize: 'md',
    maskClickClose: true,
  }

  componentDidUpdate (preProps: ModalProps) {
    if (this.props.visible !== preProps.visible) {
      if (this.props.visible) {
        setTimeout(() => {
          if (this.props.showCallBack) {
            this.props?.showCallBack()
          }
        }, 300)
      }
    }
  }

  handleCancel = () => {
    const { onCancel } = this.props
    onCancel && onCancel()
  }

  handleOk = () => {
    const { onOk } = this.props
    onOk && onOk()
  }

  wrapClick = () => {
    if (this.props.maskClickClose) {
      this.props.onCancel()
    }
    if (this.props.maskClick) {
      this.props.maskClick()
    }
  }

  contentClick = (e: any) => {
    e.stopPropagation()
  }

  render () {
    const { visible, className, title, children, okText, showCloseIcon, preMunt, btnSize, ...restProps } = this.props
    if (!visible && !preMunt) {
      return null
    }
    return (
      <ModalContainer
        visible={visible}
        className={className}
        {...restProps}
      >
        <div>
          <div className='cf_modal_mask' />
          <div className='cf_modal_wrap' onClick={this.wrapClick}>
            <div className='cf_modal_container' onClick={(e) => this.contentClick(e)}>
              {
                showCloseIcon ? <div className='cf_modal_close' onClick={this.handleCancel}>
                  <Icon name="guanbi-daohanglan" style={{ fontSize: '22px' }}/>
                </div> : null
              }
              {
                !!title ? <div className={`cf_modal_title`}>
                  { title }
                </div> : null
              }
              <div className='cf_modal_content'>
                { children }
              </div>
              {
                !!okText ? <div className={`cf_modal_btn`}>
                  <Button size={btnSize} onClick={this.handleOk}>{okText}</Button>
                </div> : null
              }
            </div>
          </div>
        </div>
      </ModalContainer>
    )
  }
}

export default BaseModal

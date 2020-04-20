import React from 'react'
import ModalContainer from './ModalContainer'

export interface ModalCustomProps {
  visible: boolean;
  className: string;
  maskClick: () => void;
  preMunt: boolean;
}

class CustomModal extends React.Component<ModalCustomProps, any> {

  static ModalContainer = ModalContainer

  static defaultProps = {
    preMunt: false,
  }

  constructor (props: ModalCustomProps) {
    super(props)
    this.state = {
      visible: props.visible,
    }
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
    const { visible, className, children, preMunt } = this.props
    if (!visible && !preMunt) {
      return null
    }
    return (
      <ModalContainer
        visible={visible}
        className={className}
      >
        <div>
          <div className='cf_modal_mask' />
          <div className='cf_modal_wrap' onClick={this.wrapClick}>
            <div className='cf_cus_modal_content' onClick={(e) => this.contentClick(e)}>
              {
                children
              }
            </div>
          </div>
        </div>
      </ModalContainer>
    )
  }
}

export default CustomModal

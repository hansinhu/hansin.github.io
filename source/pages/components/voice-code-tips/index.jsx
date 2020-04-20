import React from 'react'
import PropTypes from 'prop-types'

import {
  Icon,
  StatefulToolTip,
  Button,
} from '@/pages/components'

import * as styles from './index.less'

class VoiceCodeTips extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    name: 'Get voice code',
  }

  toolEl = null

  render () {
    return <StatefulToolTip
      ref={el => { this.toolEl = el }}
      targetType='click'
      parent={ <span
        className={styles.link_text}
        onClick={() => {
          if (this.toolEl) {
            this.toolEl.handleVisible()
          }
        }}
      > {this.props.name}</span> }
      position='bottom'
      arrow='center'
      style={{
        style: { zIndex: 1999, background: '#fff', color: '#666' },
        arrowStyle: {
          borderColor: '#fff',
        },
      }}
    >
      <div className={styles.tips_wrap}>
        <div className={styles.left}><Icon name='notice' style={{ color: '#FAAD14' }} /></div>
        <div className={styles.right}>
          <div className={styles.tips}>{"We will inform you of the code by the +44 (UK) number, if you are ready to answer it, please click 'confirm'."}</div>
          <div className={styles.btns}>
            <Button
              type='white'
              size='sm'
              className={styles.btn}
              onClick={() => {
                if (this.toolEl) {
                  this.toolEl.handleHidden()
                }
              }}
            >Cancel</Button>
            <Button
              onClick={this.props.onClick}
              size='sm'
              className={styles.btn}
            >Confirm</Button>
          </div>
        </div>
      </div>
    </StatefulToolTip>
  }
}
export default VoiceCodeTips

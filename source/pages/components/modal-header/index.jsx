import React from 'react'
import propsTypes from 'prop-types'
import { Icon } from '@/pages/components'

import * as styles from './index.less'

const ModalHeader = (props) => {
  return <div className={styles.header} style={props.style}>
    <span onClick={props.onBack}>
      <Icon
        className={styles.back}
        name='go_back'
      />
    </span>
    <span>{props.title}</span>
  </div>
}

ModalHeader.propTypes = {
  onBack: propsTypes.func,
  title: propsTypes.string,
  style: propsTypes.object,
}

export default ModalHeader

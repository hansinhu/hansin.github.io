import React from 'react'
import PropTypes from 'prop-types'

import * as styles from './ListEmpty.less'

class ListEmpty extends React.Component {
  static propTypes = {
    content: PropTypes.node,
  }

  render () {
    const { content } = this.props
    return (
      <div className={styles.wrapper}>
        <div className={styles.imageWrapper}>
          <img src={ require('@/img/empty_box.png') } />
        </div>
        <div>{ content }</div>
      </div>
    )
  }
}

export default ListEmpty

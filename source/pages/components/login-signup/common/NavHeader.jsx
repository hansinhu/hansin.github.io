import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@/pages/components'
import * as styles from './NavHeader.vw.less'

class NavHeader extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    handleBack: PropTypes.func,
    customBack: PropTypes.func,
  }

  handleBack = () => {
    const { customBack } = this.props
    if (customBack) {
      customBack()
    } else {
      // 默认回调操作
      window.history.go(-1)
    }
  }

  render () {
    const { title } = this.props
    return <div className={styles.nav_wrap}>
      <div className={styles.nav_header}>
        <div className={styles.nav_opration} onClick={this.handleBack}>
          <Icon name='qianjin-copy' className={styles.opration_icon} />
        </div>
        <div className={styles.nav_title}>{ title }</div>
        <div className={styles.nav_opration}></div>
      </div>
    </div>
  }
}
export default NavHeader

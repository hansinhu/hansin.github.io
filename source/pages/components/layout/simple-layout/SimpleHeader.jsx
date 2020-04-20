import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './SimpleHeader.less'

const SimpleHeader = ({ history }) => {
  const toHome = () => {
    history.push('/')
  }

  return <header className={styles.header_wrap}>
    <div className={styles.header_content}>
      <div
        onClick={toHome}
        className={styles.cf_logo}
      />
    </div>
  </header>
}

SimpleHeader.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(SimpleHeader)

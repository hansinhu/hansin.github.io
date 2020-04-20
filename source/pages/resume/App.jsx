import React from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import { observer } from 'mobx-react'
import * as styles from './App.less'

require('@/styles/common/index.less')

@hot(module)
@observer
class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
  }

  pathName = null

  render () {
    return (
      <div className={`${styles.app}`}>
        <div className={styles.resume}>sssssss</div>
      </div>
    )
  }
}

export default App

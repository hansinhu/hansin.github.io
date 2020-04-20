import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import {
  Button,
} from '@/pages/components'
import * as styles from './GgAndFbLogin.less'

@observer
class GgLoginBtn extends React.Component {
  static propTypes = {
    initGoogleScript: PropTypes.func,
    loginByGoogleToken: PropTypes.func,
    btnText: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  }
  static defaultProps = {
    btnText: 'Google',
  }

  componentDidMount () {
    this.props.initGoogleScript()
  }

  render () {
    const { loginByGoogleToken, style, className } = this.props
    return <div style={style} className={className}>
      <Button
        onClick={loginByGoogleToken}
        className={classNames(styles.third_login_btn, styles.gg_btn)}
      ><img src={require('@/img/pc_site/google_icon.png')}/>{this.props.btnText}</Button>
    </div>
  }
}
export default GgLoginBtn

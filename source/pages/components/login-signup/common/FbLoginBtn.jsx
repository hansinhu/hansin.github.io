import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import {
  Button,
} from '@/pages/components'
import * as styles from './GgAndFbLogin.less'

@observer
class FbLoginBtn extends React.Component {
  static propTypes = {
    initFacebookScript: PropTypes.func,
    loginByFacebookToken: PropTypes.func,
    className: PropTypes.string,
    btnText: PropTypes.string,
    style: PropTypes.object,
  }
  static defaultProps = {
    btnText: 'Facebook',
  }

  componentDidMount () {
    this.props.initFacebookScript()
  }

  render () {
    const { loginByFacebookToken, style, className } = this.props
    return <div style={style} className={className}>
      <Button
        onClick={loginByFacebookToken}
        className={classNames(styles.third_login_btn, styles.fb_btn)}
      ><img src={require('@/img/pc_site/facebook_icon.png')}/>{this.props.btnText}</Button>
    </div>
  }
}
export default FbLoginBtn

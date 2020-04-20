import React from 'react'
import FbLoginBtn from './FbLoginBtn'
import GgLoginBtn from './GgLoginBtn'
import * as styles from './GgAndFbLogin.less'

interface GgAndFbLoginProps {
  initGoogleScript: () => void;
  initFacebookScript: () => void;
  loginByFacebookToken: () => void;
  loginByGoogleToken: () => void;
}

class GgAndFbLogin extends React.PureComponent<GgAndFbLoginProps> {
  render () {
    const { initFacebookScript, initGoogleScript, loginByFacebookToken, loginByGoogleToken } = this.props
    return <div className={styles.m_login_gbgl}>
      {/* <FbLoginBtn
        initFacebookScript={initFacebookScript}
        loginByFacebookToken={loginByFacebookToken}
      /> */}
      <GgLoginBtn
        initGoogleScript={initGoogleScript}
        loginByGoogleToken={loginByGoogleToken}
      />
    </div>
  }
}
export default GgAndFbLogin

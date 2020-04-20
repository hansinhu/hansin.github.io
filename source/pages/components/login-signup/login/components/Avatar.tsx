import React from 'react'
import * as styles from './Avatars.less'

interface AvatarProps {
  account?: string;
  avatarUrl?: string;
  showText?: string;
}

class Avatar extends React.PureComponent<AvatarProps, any> {
  constructor (props) {
    super(props)
    this.state = {
      imgUrl: props.avatarUrl || require('@/img/b2b_avatar.png'),
      // imgUrl: props.avatarUrl || '//f.cfcdn.club/assets/ad023982d3c0708792d9fc4f30c1f316_160x160.png',
    }
  }
  
  render () {
    const { account, showText } = this.props
    const { imgUrl } = this.state
    return <div className={styles.avatar}>
      {
        !imgUrl && showText
          ? <div className={styles.avatar_img}>{showText.substr(0, 1)}</div>
          : <div className={styles.avatar_img}>
              {
                imgUrl ? <img
                  src={imgUrl}
                  onError={() => {
                    this.setState({ imgUrl: null }) }
                  }
                /> : null
              }
            </div>
      }
      
      {
        account ? <div className={styles.avatar_account}>{account}</div> : null
      }
    </div>
  }
}
export default Avatar

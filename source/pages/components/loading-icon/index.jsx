import React from 'react'
import PropTypes from 'prop-types'

import * as styles from './loading-icon.less'

const LoadingIcon = (props) => {
  if (props.type === 'circle') {
    return <svg version='1.1' xmlns='http://www.w3.org/2000/svg'
      style={props.style}
      width={props.width || 40} height={props.height || 40} viewBox='0 0 50 50'>
      <path fill={ props.color || '#999' } d='M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z'>
        <animateTransform attributeType='xml'
          attributeName='transform'
          type='rotate'
          from='0 25 25'
          to='360 25 25'
          dur='0.6s'
          repeatCount='indefinite'/>
      </path>
    </svg>
  } else if (props.type === 'cf') {
    return <div className={styles.cf_loading}>{
      'Club Factory'.split('').map((char, i) => {
        return <span key={i} className={styles['char_' + i]}>{char}</span>
      })
    }</div>
  } else {
    return <svg version='1.1' xmlns='http://www.w3.org/2000/svg'
      width={48} height={30} viewBox='0 0 24 30'>
      <rect x='0' y='10' width={3} height={8} fill={ props.color || '#333' } opacity='0.2'>
        <animate attributeName='opacity' attributeType='XML' values='0.2; 1; .2' begin='0s' dur='0.6s' repeatCount='indefinite' />
        <animate attributeName='height' attributeType='XML' values='8; 16; 8' begin='0s' dur='0.6s' repeatCount='indefinite' />
        <animate attributeName='y' attributeType='XML' values='8; 4; 8' begin='0s' dur='0.6s' repeatCount='indefinite' />
      </rect>
      <rect x='12' y='10' width={3} height={8} fill={ props.color || '#333' } opacity='0.2'>
        <animate attributeName='opacity' attributeType='XML' values='0.2; 1; .2' begin='0.15s' dur='0.6s' repeatCount='indefinite' />
        <animate attributeName='height' attributeType='XML' values='8; 16; 8' begin='0.15s' dur='0.6s' repeatCount='indefinite' />
        <animate attributeName='y' attributeType='XML' values='8; 4; 8' begin='0.15s' dur='0.6s' repeatCount='indefinite' />
      </rect>
      <rect x='24' y='10' width={3} height={8} fill={ props.color || '#333' } opacity='0.2'>
        <animate attributeName='opacity' attributeType='XML' values='0.2; 1; .2' begin='0.3s' dur='0.6s' repeatCount='indefinite' />
        <animate attributeName='height' attributeType='XML' values='8; 16; 8' begin='0.3s' dur='0.6s' repeatCount='indefinite' />
        <animate attributeName='y' attributeType='XML' values='8; 4; 8' begin='0.3s' dur='0.6s' repeatCount='indefinite' />
      </rect>
    </svg>
  }
}

LoadingIcon.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
}

export default LoadingIcon

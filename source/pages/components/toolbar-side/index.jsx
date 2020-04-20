import React, { useState, useEffect } from 'react';
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from '@/pages/components'
require('./index.less')

const ToolbarSide = (props) => {
  const [show, setShow] = useState(false);

  let timer = null

  const onScroll = () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      setShow(window.scrollY > 500)
    }, 100)
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timer) {
        clearTimeout(timer)
      }
    }
  })

  const toScrollTop = () => {
    function checkElement () {
      // chrome,safari及一些浏览器对于documentElemnt的计算标准化,reset的作用
      document.documentElement.scrollTop += 1
      let elm = document.documentElement.scrollTop !== 0 ? document.documentElement : document.body
      document.documentElement.scrollTop -= 1
      return elm
    }

    const { to: lastPosition } = props // 最终滚动到位置
    let element = checkElement()
    let start = element.scrollTop // 当前滚动距离
    const duration = start - lastPosition
    let count = 0
    let speed = 0.05

    function scroll () { // 滚动的实现
      count++
      speed += 0.01 // 逐渐加速
      element.scrollTop = start - duration * count * speed
      if ((element.scrollTop - lastPosition) * duration <= 0) {
        element.scrollTop = lastPosition
        return
      }
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(scroll)
      } else {
        window.scrollTo(0, lastPosition)
      }
    }

    scroll()
  }

  return <div className='toolbar_side'>
    <div
      onClick={toScrollTop}
      className={classNames('toolbar_top', {
        'tool_show': show,
        'tool_hidden': !show,
      })}
    >
      <Icon className='top_icon' name='liebiaoyouxiangshangjiantou'/>
      TOP
    </div>
  </div>
}

ToolbarSide.propTypes = {
  to: PropTypes.number,
}

ToolbarSide.defaultProps = {
  to: 0,
}

export default ToolbarSide

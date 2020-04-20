import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import { setCountry, getCountry } from 'pc/tool'

// 暂时只放开印度、沙特、阿联酋
if (!['in', 'sa', 'ae'].includes(getCountry())) {
  setCountry('in')
}

/**
 * Route-props:
 * layout: default / simple
 * layoutParams: 布局差异需要一些参数。fullPage： 子页面需要全屏。hiddenFooter： 需要隐藏footer
 */

ReactDOM.render(
  <App />,
  document.querySelector('#app'),
  () => {},
)


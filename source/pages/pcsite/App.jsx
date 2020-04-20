import React from 'react'
import PropTypes from 'prop-types'
import { matchPath } from 'react-router'
import { hot } from 'react-hot-loader'
import { inject, observer } from 'mobx-react'
import Sentry from '@/setup/sentry'
import facebookPixel from 'pc/setup/setup-facebook-pixel'
import googleGtag from 'pc/setup/setup-google-gtag'

import * as styles from './App.less'

import { GenderModal, DefaultLayout, SimpleLayout, trace } from '@/pages/components'
import { getLanguage } from 'pc/tool'

require('@/styles/common/index.less')

@hot(module)
@observer
class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
  }

  pathName = null

  componentDidCatch (error, errorInfo) {
    Sentry.captureException(error, {
      extra: {
        info: errorInfo,
        logger: 'react.msite.componentDidCatch',
        props: this.props,
      },
      logger: 'react.msite.componentDidCatch',
      tags: {
        componentName: 'PCSite',
      },
    })
  }

  componentDidMount () {
    this.pageViewReport()
  }

  componentDidUpdate () {
    const { location } = this.props
    const pathName = location.pathname
    if (this.pathName !== pathName) {
      this.pathName = pathName
      this.pageViewReport()
    }
  }

  pageViewReport = () => {
    trace.register()
    // googleGtag page_view 上报，这里，应该放到react-route处理
    googleGtag.sendPageView()
    // facebook页面曝光
    facebookPixel.sendPageView()
  }

  getCurrentChild = (children, pathName) => {
    const currentChild = children.find((child, _idx) => {
      const math = matchPath(pathName, {
        path: child.props.path,
        exact: child.props.exact,
        strict: child.props.strict || false,
      })
      return !!math
    })
    return currentChild
  }

  getLayout = (key) => {
    const layoutMap = {
      'default': DefaultLayout,
      'simple': SimpleLayout,
    }
    return layoutMap[key] || DefaultLayout
  }

  render () {
    const { children, location } = this.props
    const pathName = location.pathname
    const arryChildren = React.Children.toArray(children)
    const currentChild = this.getCurrentChild(arryChildren, pathName)
    // 获取布局
    const PageLayout = this.getLayout(currentChild?.props?.layout)
    const layoutParams = currentChild?.props?.layoutParams || {}
    const language = getLanguage()
    return (
      <div className={`${styles.app} ${language === 'ar' ? styles.rtl : styles.ltr}`}>
        <PageLayout {...layoutParams}>
          { children }
        </PageLayout>
        <GenderModal onItemClick={() => { window.location.reload() }} />
      </div>
    )
  }
}

export default App

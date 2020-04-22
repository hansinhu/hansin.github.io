import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { createBrowserHistory } from 'history'
import PropTypes from 'prop-types'

import stores from './store'

import App from './App'
import Home from './home'
import PaymentSuccess from './payment_success'

import { utils } from '@/pages/components'

require('@/setup/sentry')

Route.propTypes.path = PropTypes.oneOfType([PropTypes.array, PropTypes.string])

const history = utils.syncHistoryWithStore(createBrowserHistory(), stores.router)

/**
 * Route-props:
 * layout: default / simple
 * layoutParams: 布局差异需要一些参数。fullPage： 子页面需要全屏。hiddenFooter： 需要隐藏footer
 */

ReactDOM.render(
  <Provider {...stores}>
    <Router history={history}>
      <Switch>
        <Route render={(props) => {
          return <App {...props}>
            <Route path="/" exact component={Home} layoutParams={{ hiddenFooter: true }}/>
            <Route path="/payment_success" exact component={PaymentSuccess} layout='simple'/>
          </App>
        }} />
      </Switch>
    </Router>
  </Provider>,
  document.querySelector('#app'),
  () => {},
)


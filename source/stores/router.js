import { observable, action } from 'mobx'

export default class RouterStore {
  @observable location = '/'
  history = null

  @action
  _updateLocation (newState) {
    this.location = newState
  }

  push = (location, state = {}) => {
    if (/^\/pages\/msite/.test(this.location.pathname)) {
      this.history.push('/pages/msite' + location)
    } else {
      this.history.push(location)
    }
    window.scrollTo(0, 0)
  }

  replace = (location, state = {}) => {
    if (/^\/pages\/msite/.test(this.location.pathname)) {
      this.history.replace({
        pathname: '/pages/msite' + location,
        state,
      })
    } else {
      this.history.replace(location)
      // this.history.replace({
      //   pathname: location,
      //   state,
      // })
    }
    window.scrollTo(0, 0)
  }

  go = (n) => {
    this.history.go(n)
  }

  goBack = () => {
    this.history.goBack()
  }

  goForward = () => {
    this.history.goForward()
  }
}

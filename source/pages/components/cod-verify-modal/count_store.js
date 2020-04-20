import { observable, action, computed, autorun, transaction } from 'mobx'
import n from 'numeral'

const RESIDUAL = 1 * 1000 // 残差

class CountTimer {
  @observable counter = 0
  @observable remaining = 0
  @observable timer = 0

  @observable.ref sTimestamp = new Date().getTime()
  @observable.ref cTimestamp = new Date().getTime()

  constructor (cb) {
    this.handler = autorun(() => {
      if (this.remaining <= 0 && this.timer) {
        clearInterval(this.timer)
        // callback
        return cb?.()
      }

      const duration1 = this.cTimestamp - this.sTimestamp // millisecond
      const duration2 = (this.counter - this.remaining) * 1000

      const r = Math.abs(duration1 - duration2)
      // 误差大于 RESIDUAL
      if (r > RESIDUAL) {
        if (duration1 > duration2) {
          if (this.remaining - r / 1000 > 0) {
            this.remaining = this.remaining - r / 1000
          } else {
            this.remaining = 0
            if (this.timer) {
              clearInterval(this.timer)
            }
          }
        } else {
          this.remaining = this.remaining + r / 1000
        }
      }
    })
  }

  @action
  start () {
    transaction(() => {
      // clear interval
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.remaining = this.counter
      this.sTimestamp = new Date().getTime() // 记录起始时间戳
      this.cTimestamp = new Date().getTime() // 记录当前时间戳
    })

    if (this.remaining > 0) {
      this.timer = setInterval(() => { // setInterval 会累积误差
        transaction(() => {
          this.remaining--
          this.cTimestamp = new Date().getTime()
        })
      }, 1000)
    }
  }

  @action
  stop () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  @action
  reset (counter) {
    this.counter = Math.abs(counter) | 0
    this.start()
  }

  @action
  destroy () {
    this.handler()
    this.stop()
  }

  @computed
  get seconds () {
    const [,, s] = n(Math.abs(this.remaining)).format(':').split(':')
    return s
  }

  @computed
  get minutes () {
    const [, m] = n(Math.abs(this.remaining)).format(':').split(':')
    return m
  }

  @computed
  get hours () {
    const [h] = n(Math.abs(this.remaining)).format(':').split(':')
    return h.padStart(2, '0') // 两位数小时，如果位数不够以'0'补齐
  }
}

export default CountTimer

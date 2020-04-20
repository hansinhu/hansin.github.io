import { observable, action } from 'mobx'
import { utils } from '@/pages/components'

class CodModalStore {
  // 半弹窗是否显示
  @observable visible = false
  // 错误样式
  @observable errorInfo = {
    message: '',
    className: '',
  }

  constructor () {
    // 第一次倒计时结束
    this.firstOverTime = false
  }

  @action.bound
  toggleModal (visible) {
    this.visible = visible
  }

  @action
  setError = (message, className) => {
    this.errorInfo = {
      message: message,
      className: className,
    }
  }

  @action
  setFirstTimeover = () => {
    this.firstOverTime = true
  }
}

export default new CodModalStore()

/**
  * @file Trace.ts
  * @Synopsis m站打点工具
  * @author 徐敏辉
  * @date 2019-06-12
  */

// [数据接口](http://wiki.yuceyi.com/pages/viewpage.action?pageId=22617381)
export interface H5Event {
  // _ga
  cid: string
  tid: string
  // 事件的mid
  mid: string
  // 事件
  url: string
  // 时间戳
  ts: string
  // referer 页面来源
  // ref: string
  // referer 页面来源 id
  // fr: string
  // 来源组件id
  os: string
  fmid: string
  // 访问深度
  in: number
  sw: number
  sh: number
  did: string
  lang: string
  cc: string
  g: string
  xid: string
  vid: string
  u?: string
}

abstract class ReportController {
  constructor (private readonly id: number) {
    // TODO 每次事件都上报
    // const xhr = new XMLHttpRequest()
    // const config = `${this.url}/config/limit.json`
    // const that = this
    // xhr.onload = function () {
    //   const resp = this.response.body
    //   if (resp) {
    //     that.length = resp.length
    //     that.duration = resp.duration
    //   }
    // }
    // xhr.open('GET', config, true)
    // xhr.responseType = 'json'
    // xhr.send()
  }

  private readonly url = `${window.location.protocol}//track.clubfactory.com`

  static uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  public send(event: H5Event): void {
    const traceUrl = `${this.url}/trace`
    const xhr = new XMLHttpRequest()
    xhr.open('POST', traceUrl, true)
    // 注意使用简单请求，避免跨域的OPTIONS请求
    xhr.setRequestHeader('Content-Type', 'text/plain')
    xhr.responseType = 'json'

    xhr.send(JSON.stringify({
      events: [event],
    }))
    // 压入队列
    // this.queuedEvents.push(event)
    //
    // if (!this.eventSender) {
    //   const traceUrl = `${this.url}/trace`
    //   // 消费队列
    //   this.eventSender = window.setInterval(() => {
    //     let toReport: H5Event[] = []
    //     if (this.queuedEvents.length > 0) {
    //       toReport = this.queuedEvents.splice(0, this.length)
    //     }
    //
    //     if (toReport.length > 0) {
    //       const xhr = new XMLHttpRequest()
    //       xhr.open('POST', traceUrl, true)
    //       xhr.setRequestHeader('Content-Type', 'application/json')
    //       xhr.responseType = 'json'
    //
    //       xhr.send(JSON.stringify({
    //         events: toReport
    //       }))
    //     }
    //   }, this.duration)
    // }
  }

  public queuedEvents: H5Event[] = []
  public eventSender?: number

  // 上报长度
  public length: number = 2
  // 上报周期
  public duration: number = 1000
  // 页面ID
  public pageId: number = 1

  // 参考 [wiki](http://wiki.yuceyi.com/pages/viewpage.action?pageId=27225185)
  private getCurrentPageId(): number {
    // TODO 设置当前页面的event_id
    let pageId: number = this.pageId
    switch (window.location.pathname) {
      case '/':
      case '/home':
        pageId = 1
        break
      case '/categories':
        pageId = 2
        break
      case '/cart':
        pageId = 3
        break
      case '/search/keyword':
        pageId = 14
        break
      case '/payment':
        pageId = 6 // 下单支付在同一个页面，eventId置为6
        break
      case '/cod_success':
      case '/payment_success':
        pageId = 11
        break
      default:
    }
    if (/\/categories\/first/.test(window.location.pathname)) {
      pageId = 2
    } else if (/\/product\/+\d/.test(window.location.pathname)) {
      pageId = 5
    } else if (/\/categories\/+\d/.test(window.location.pathname)) {
      pageId = 8
    } else if (/\/search\?q=/.test(window.location.href)) {
      pageId = 15
    } else if (/\/product\/similar\/+\d/.test(window.location.pathname)) {
      pageId = 60
    }
    return pageId
  }

  // TODO 补全
  private eventHydrate(event: object): H5Event {
    const pageId = this.getCurrentPageId()

    // mid 按照需求，1:app，2:m站，3:pc站，4:站外web
    let mid = `${this.id}.${pageId}`
    if (event['mid']) {
      // 特定场景event['mid']直接加了pageId
      if (event['mid'].split('.').length > 2) {
        mid = `${this.id}.${event['mid']}`
      } else {
        mid = `${mid}.${event['mid']}`
      }
    }

    let u = ''
    try {
      const localUser = window.localStorage.getItem('user')
      u = localUser ? JSON.parse(localUser).uid : ''
    } catch (_error) {}

    return <H5Event> {
      ...event,
      cid: Cookies.get('_ga') || Cookies.get('device_id'),
      mid,
      ts: `${+new Date()}`,
      url: window.location.pathname,
      tid: ReportController.uuidv4(),
      os: window.navigator.userAgent,
      sw: window.innerWidth,
      sh: window.innerHeight,
      did: Cookies.get('device_id'),
      lang: window.localStorage.getItem('language') || 'en-US',
      cc: window.localStorage.getItem('country_code') || '',
      g: window.localStorage.getItem('gender') || '',
      xid: Cookies.get('experiment_id') || '',
      vid: Cookies.get('variation_id') || '',
      u,
    }
  }

  // 点击事件
  public click(event: object): void {
    this.clickImpl(this.eventHydrate(event))
  }

  // 商品曝光
  public expose(event: object): void {
    this.exposeImpl(this.eventHydrate(event))
  }

  // 页面曝光
  public register(): void {
    this.registerImpl({
      ...this.eventHydrate({}),
      // 页面曝光mid类型：${id}.${pageId}
      mid: `${this.id}.${this.getCurrentPageId()}`,
    })
  }

  // 接口调用
  public api(event: object): void {
    this.apiImpl(this.eventHydrate(event))
  }

  // 支付成功
  public pay(event: object): void {
    this.payImpl(this.eventHydrate(event))
  }

  public registerGL(event): void {
    this.send({
      ...this.eventHydrate({}),
      ...event,
    })
  }
  abstract clickImpl(event: H5Event): void
  abstract exposeImpl(event: H5Event): void
  abstract registerImpl(event: H5Event): void
  abstract payImpl(event: H5Event): void
  abstract apiImpl(event: H5Event): void
}

class TraceController extends ReportController {
  clickImpl(event) {
    return this.send({
      ...event,
      et: 'click',
    })
  }

  exposeImpl(event) {
    return this.send({
      ...event,
      et: 'product',
    })
  }

  apiImpl(event) {
    return this.send({
      ...event,
      et: 'api',
    })
  }

  registerImpl(event) {
    return this.send({
      ...event,
      et: 'impression',
    })
  }

  payImpl(event) {
    return this.send({
      ...event,
      et: 'pay_success',
    })
  }
}


/**
 * 静态打点发送 by image
 * @param string url
 */
const TraceStatistic =  function (url:string) {
  if (!url) return
  // 先new一个Image对象，并且生成一个随机KEY，用于存储该对象到全局变量，防止JS垃圾回收机制，在进行较重的DOM操作时，将这个没有被二次引用的对象销毁，从而导致统计量丢失
  let img:any
  img = new Image();
  // 这里是生成了一个36位(0~9,A~Z,10+26=36)随机数，
  // 32bit最大正整数为214783647，这里的取值范围是0到该最大值
  // 目的是尽量减少KEY的重复
  const key = `CF_FED_log_${Math.floor(Math.random() * 2147483648).toString(36)}`;
  window[key] = img;
  // 显式指定img加载相关的事件
  img.onload = img.onerror = img.onabort = function () {
    // img标签加载完成、错误或终止时，解除事件绑定，销毁相关对象
    img.onload = img.onerror = img.onabort = null;
    window[key] = null;
    img = null;
  };
  // 指定img的src属性，触发加载
  img.src = url;
}


export {
  TraceController,
  TraceStatistic,
}

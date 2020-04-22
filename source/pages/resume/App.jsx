import React from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader'
import { observer } from 'mobx-react'
import * as styles from './App.less'

require('@/styles/common/index.less')

@hot(module)
@observer
class App extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
  }

  baseInfo = [
    {
      t: '电话',
      v: '18667933320',
    },
    {
      t: '邮箱',
      v: 'hansincn@gmail.com',
    },
    {
      t: '学历',
      v: '本科',
    },
    {
      t: '居住地',
      v: '杭州',
    },
    {
      t: '生日',
      v: '1991/02/02',
    },
  ]

  title = (t) => {
    return <div className={styles.title}>
      <span>{t}</span>
    </div>
  }

  render () {
    return (
      <div className={`${styles.app}`}>
        <div className={styles.resume}>
          <div className={styles.name}>Hansin</div>
          <div className={styles.info}>
            {
              this.baseInfo.map(info => {
                return <span key={info.t}>
                  {`${info.t}: `}
                  {
                    info.link ? <a
                      href={info.link}
                      rel="noopener noreferrer"
                      target="_blank"
                    >{info.v}</a> : info.v
                  }
                </span>
              })
            }
          </div>
          <div>{this.title('自我概述')}</div>
          <div className={styles.content}>从事web前端开发工作5年；拥有扎实的前端技术栈，主导或参与开发过多个项目，能结合实际场景做出技术选型，架构设计；React、Vue、React-Native项目经验丰富，深入理解组件化开发；拥有一定的Nodejs开发经验，如前端渲染服务、接口聚合、前端脚手架、命令行等项目；长期的C端千万DAU项目经验保障了对业务的理解力和敏感性，沉淀出的理论也能快速复用到其他产品。</div>
          <div>{this.title('专业技能')}</div>
          <div className={styles.content}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel, culpa? Commodi iste velit alias cum dignissimos libero itaque eos expedita numquam, natus porro facere fugit inventore, placeat provident recusandae vero?</div>
          <div>{this.title('工作经历')}</div>
          <div className={styles.content}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel, culpa? Commodi iste velit alias cum dignissimos libero itaque eos expedita numquam, natus porro facere fugit inventore, placeat provident recusandae vero?</div>
          <div>{this.title('教育背景')}</div>
          <div className={styles.content}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel, culpa? Commodi iste velit alias cum dignissimos libero itaque eos expedita numquam, natus porro facere fugit inventore, placeat provident recusandae vero?</div>
          <div>{this.title('项目经历')}</div>
          <div className={styles.content}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel, culpa? Commodi iste velit alias cum dignissimos libero itaque eos expedita numquam, natus porro facere fugit inventore, placeat provident recusandae vero?</div>

        </div>
      </div>
    )
  }
}

export default App

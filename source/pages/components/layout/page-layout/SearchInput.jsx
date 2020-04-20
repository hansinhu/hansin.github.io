import React from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AutoComplete, trace, Icon, utils } from '@/pages/components'

import * as styles from './SearchInput.less'

@inject('search_store')
@observer
class SearchInput extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    history: PropTypes.object.isRequired,
    search_store: PropTypes.object,
  }
  constructor (props) {
    super(props)
    this.state = {
      keyword: '',
      historyList: [],
    }
    this.autoCompleteEl = null
  }

  componentDidMount () {
    const keyword = utils.getQuery().q
    this.setState({ keyword })
    // 热搜词
    const { hotwords, getHotwords } = this.props.search_store
    if (!hotwords.length) {
      getHotwords()
    }
    // 搜索记录
    const local_search_history = localStorage.getItem('search_history')
    if (local_search_history) {
      const localHistory = local_search_history.split(',')
        .map(item => {
          return decodeURIComponent(item)
        })
      this.setState({
        historyList: localHistory || [],
      })
    }
  }

  historyDelet = (e, idx) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (idx === undefined) {
      // clear all
      this.setState({
        historyList: [],
      }, this.saveHistoryToLocal)
    } else {
      // clear one item
      const list = this.state.historyList
      list.splice(idx, 1)
      this.setState({ historyList: list }, this.saveHistoryToLocal)
    }
  }

  saveHistoryToLocal = () => {
    // historyDelet后需要更新AutoComplete
    this.autoCompleteEl?.updateDateWarp()
    const historyStr = this.state.historyList.map(words => {
      return encodeURIComponent(words)
    }).join(',')
    if (historyStr) {
      localStorage.setItem('search_history', historyStr)
    } else {
      localStorage.removeItem('search_history')
    }
  }

  keyWordsSelect = (val) => {
    this.setState({
      keyword: val,
    }, this.toSearch)
  }

  historyKeyWordsSelect = (val) => {
    this.setState({
      keyword: val,
    }, () => {
      this.autoCompleteEl?.hiddenDateWarp()
      this.toSearch()
    })
  }

  inputChange = (val) => {
    this.setState({
      keyword: val,
    })
    if (val && this.autoCompleteEl) {
      this.autoCompleteEl?.hiddenDateWarp()
    } else if (!val) {
      this.autoCompleteEl?.focus()
    }
  }

  handleKeyUp = (e) => {
    if (e?.keyCode === 13) {
      this.toSearch()
    }
  }

  toSearch = () => {
    const { keyword } = this.state
    if (keyword) {
      // 储存到本地
      const list = this.state.historyList
      const index = list.findIndex(item => item === keyword)
      if (index !== -1) {
        list.splice(index, 1)
      }
      list.unshift(keyword)
      this.setState({
        historyList: list.splice(0, 10), // 最多储存10个
      }, this.saveHistoryToLocal)
      // 路由更新
      this.props.history.push(`/search?q=${encodeURIComponent(keyword)}`)
    }
  }

  searchIconClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.toSearch()
  }

  getHistoryNode = (historyList) => {
    return (
      <div className={styles.option_footer}>
        <div className={styles.option_title}><span>History</span><span onClick={(e) => { this.historyDelet(e) }}>Clear All</span></div>
        <ul>
          {
            historyList.map((history, idx) => {
              return <li className={styles.history_item} onClick={() => this.historyKeyWordsSelect(history)} key={idx}>
                <span><Icon name='J_Recent' className={styles.time_icon} /> <span>{history}</span></span>
                <span onClick={(e) => { this.historyDelet(e, idx) }}><Icon name='quxiao-bandanchuang' /></span>
              </li>
            })
          }
        </ul>
      </div>
    )
  }

  render () {
    const { hotwords } = this.props.search_store
    const { historyList } = this.state
    return <div onClick={() => { trace.click({ mid: '20.4' }) }}>
      <AutoComplete
        ref={el => { this.autoCompleteEl = el }}
        placeholder='What are you looking for?'
        customeOptionHeader={<div className={styles.option_title}>Trending</div>}
        customeOptionFooter={historyList.length ? this.getHistoryNode(historyList) : null}
        optionClassName={styles.search_auto_complete}
        options={hotwords.slice(0, 10)}
        onChange={this.inputChange}
        handleSelected={this.keyWordsSelect}
        onKeyUp={this.handleKeyUp}
        value={this.state.keyword}
        maxLength={99}
        className={styles.search_input}
        extra={
          <div
            onClick={this.searchIconClick}
            className={styles.search_icon}
          >
            <Icon name='newsearch' />
          </div>
        }
      />
    </div>
  }
}
export default withRouter(SearchInput)

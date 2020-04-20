import React from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'

import { Message, ToggleMenu, LoginSignupModal, FindGuestOrderModal, trace, Icon, utils } from '@/pages/components'
import { getAuthorization, getDecodeToken, setCountry, setLanguage, getLanguage, getCountry } from 'pc/tool'
import { getMoreMenu, getCountryMenu, getLanguageMenu, getUserMenu } from './page-header-utils'
import login_store from '@/pages/components/login-signup/login_store'

import styles from './PageHeader.less'

import SearchInput from './SearchInput'

@inject('common_store')
@observer
class PageHeader extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    common_store: PropTypes.object.isRequired,
  }
  constructor (props) {
    super(props)
    this.userInfo = getDecodeToken()
    this.language = getLanguage()
    this.countryCode = getCountry()
    this.isLogin = getAuthorization()
    // is_login：老页登录临时处理方案
    const { full_login } = utils.getQuery()
    this.state = {
      login_full_bg: !!full_login,
      guest_order_visible: false,
    }
  }

  componentWillMount () {
    const { getCartNum, cartNum } = this.props.common_store
    if (!cartNum) {
      getCartNum()
    }
  }

  toHome = () => {
    this.props.history.push('/')
  }

  moreMenuItemNode = item => {
    if (item.key === 'download') {
      return <div>
        <div>{item.label}</div>
        <div>
          <a
            target='_blank'
            rel='noopener noreferrer'
            className={classNames(styles.down_icon, styles.apple)}
            href='https://apps.apple.com/us/app/club-factory-unbeaten-price/id1112879717'></a>
        </div>
        <div>
          <a
            target='_blank'
            rel='noopener noreferrer'
            className={classNames(styles.down_icon, styles.google)}
            href='https://play.google.com/store/apps/details?id=club.fromfactory&amp;utm_source=global_co&amp;utm_medium=prtnr&amp;utm_content=Mar2515&amp;utm_campaign=PartBadge&amp;pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'></a>
        </div>
      </div>
    } else {
      return item.label
    }
  }

  menuItemClick = (item) => {
    const key = item.key
    trace.click({ mid: '20.2', b: item.label })
    switch (key) {
      case 'login':
        this.props.common_store.toggleLoginModal(true)
        break
      case 'logout':
        login_store.logOut()
        break
      case 'help-center':
        window.open('/document/faq')
        break
      case 'my-order':
        if (this.isLogin) {
          window.location.href = '/user?type=order'
        } else {
          this.props.common_store.toggleLoginModal(true, '/user?type=order')
        }
        break
      case 'guest-order':
        this.setState({
          guest_order_visible: true,
        })
        break
      case 'complaint-guide':
        window.open('/doc/ipr-protection')
        break
      default:
        console.log(item.key)
    }
  }

  deliverItemClick = (item) => {
    const countryCode = item.code
    // 暂时只放开印度、沙特、阿联酋
    if (['in', 'sa', 'ae'].includes(countryCode)) {
      setCountry(countryCode)
      trace.click({ mid: '1.1' })
      setTimeout(() => {
        window.location.reload(true)
      }, 300)
    } else {
      Message.error('Please go to CF app to view more countries.')
    }
  }

  languageItemClick = (item) => {
    setLanguage(item.code)
    window.location.reload(true)
  }

  cartMenuClick = () => {
    trace.click({ mid: '20.3' })
    if (this.isLogin) {
      const { guestMergeCart } = this.props.common_store
      guestMergeCart().finally(() => {
        window.location.href = '/cart'
      })
    } else {
      window.location.href = '/cart'
    }
  }

  render () {
    const { login_full_bg } = this.state
    const { cartNum } = this.props.common_store
    const countryMenuList = getCountryMenu()
    const currentCountry = countryMenuList.find(item => item.key === this.countryCode)
    return <header className={styles.header_wrap}>
      <div className={styles.header} id='pcHeader'>
        <div className={styles.header_content}>
          <div
            onClick={this.toHome}
            className={classNames(styles.cf_logo, styles.cf_logo_b2b)}
          />
          <div className={styles.search_warp}>
            <SearchInput/>
          </div>
          <div className={styles.header_left}>
            <div className={styles.menu_item} onClick={this.cartMenuClick}>
              <div className={styles.tip_warp}>
                {
                  cartNum ? <span className={styles.tip_text}>
                    { cartNum > 99 ? '99+' : cartNum }
                  </span> : null
                }
                <Icon className={styles.menu_icon} name='Cart-Socail' />
              </div>
            </div>
            <ToggleMenu
              menuNode={
                <div className={styles.menu_item}>
                  {
                    getAuthorization()
                      ? <>
                        <div
                          title={this.userInfo.nickname || this.userInfo.account}
                          className={styles.menu_user}
                        >{this.userInfo.nickname || this.userInfo.account}</div>
                        <Icon
                          className={classNames(styles.arrow_icon, styles.arrow_icon_2)}
                          name='xiangxiajiantou' />
                      </>
                      : <Icon className={styles.menu_icon} name='Account-Socail' />
                  }
                </div>
              }
              menuItems={getUserMenu(getAuthorization())}
              menuItemClick={this.menuItemClick}
            />
            <div className={styles.menu_item}>
              <div className={styles.menu_item_text}>
                Deliver To
                {
                  currentCountry?.img ? <img className={styles.country_img} src={currentCountry.img}/> : null
                }
              </div>
            </div>
            <ToggleMenu
              className={styles.language_menu}
              menuNode={
                <div className={styles.menu_item}>
                  {this.language.substring(0, 2).toUpperCase()} <Icon className={styles.arrow_icon} name='xiangxiajiantou' />
                </div>
              }
              customItemNode={
                (item) => <div className={styles.language_item}>
                  <span className={classNames(styles.check_icon, { [styles.check_icon_active]: this.language === item.code })}></span>
                  <span className={styles.language_text}>{`${item.language} - ${item.code.substring(0, 2).toUpperCase()}`}</span>
                </div>
              }
              currentKey={this.language}
              menuItems={getLanguageMenu()}
              menuItemClick={this.languageItemClick}
            />
          </div>
        </div>
      </div>

      <LoginSignupModal
        handleCancel={ () => { this.props.common_store.toggleLoginModal(false) }}
        login_redirect={this.props.common_store.login_redirect}
        visible={this.props.common_store.loginModalVisible}
        showCloseIcon={!login_full_bg}
        maskClickClose={!login_full_bg}
        loginFullBg={!!login_full_bg}
      />
      <FindGuestOrderModal
        handleCancel={ () => { this.setState({ guest_order_visible: false }) }}
        visible={this.state.guest_order_visible} />
    </header>
  }
}

export default withRouter(PageHeader)

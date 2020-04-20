import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
// import classNames from 'classnames'
import { Carousel, LoadingPlaceholder } from 'cf-ui-mobile'
import {
  CategoryMenu,
  ProductList,
  ToolbarSide,
} from '@/pages/components'

import * as styles from './index.less'

@inject('home_store')
@observer
class HomePage extends React.Component {
  static propTypes = {
    home_store: PropTypes.object,
  }

  year = new Date().getFullYear()

  componentWillMount () {
    this.props.home_store.getProducts()
    this.props.home_store.getBanners()
  }

  loadNextPage = () => {
    this.props.home_store.getProducts()
  }

  bannerClick (jumpUrl) {
    window.location.href = jumpUrl
  }

  render () {
    const { products, is_loading_more, isReady, loadMore, banners, isBannerReady } = this.props.home_store
    const showBanner = false // 活动页暂不支持pc，banner隐藏

    return <section className={styles.home_page}>
      <div className={styles.page_left}>
        <div className={styles.sticky_block}>
          <div className={styles.category_card}>
            <CategoryMenu
              className={styles.home_category}
              cateListClassName={styles.home_cate_list}
            />
          </div>
          {
            window?.__B2BSITE__
              ? null
              : <ul className={styles.site_info}>
                <li className={styles.info_item}>
                  <a
                    href='/document/about-us'
                    rel='noopener noreferrer'
                    target='_blank'
                  >Get to Know Us</a>
                </li>
                <li className={styles.info_item}>
                  <a
                    href='/document/clubfactory-ambassador'
                    rel='noopener noreferrer'
                    target='_blank'
                  >Collaborate with Us</a>
                </li>
                <li className={styles.info_item}>
                  <a
                    href='/document/faq'
                    rel='noopener noreferrer'
                    target='_blank'
                  >Let Us Help You</a>
                </li>
                <li className={styles.info_item}>&#169; {this.year} Club Factory</li>
              </ul>
          }
        </div>
      </div>
      <div className={styles.page_right}>
        <LoadingPlaceholder
          ready={isBannerReady}
          customBlocks={<div className={styles.banner_placeholer_block}></div>}
        >
          {
            banners.length && showBanner ? <div className={styles.banner}>
              <Carousel
                className={styles.home_banner}
                infinite
                indicator
                autoplay
                afterChange={this.afterBannerChange}
              >
                {banners.map((banner, idx) => (
                  <a
                    key={idx}
                    href={banner.jumpUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ display: 'inline-block', width: '100%', height: 315 }}
                  >
                    <img
                      src={banner.imageUrl}
                      style={{ width: '100%', verticalAlign: 'top', height: 315 }}
                    />
                  </a>
                ))}
              </Carousel>
            </div> : <span></span>
          }
        </LoadingPlaceholder>
        <div>
          <div className={styles.p_list_title}>Just for You</div>
          <ProductList
            ready={isReady}
            products={products}
            is_loading={is_loading_more}
            load_more={loadMore}
            scrollToEnd={this.loadNextPage}
          />
          <ToolbarSide />
        </div>
      </div>
    </section>
  }
}

export default HomePage

import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Icon } from '@/pages/components';
require('./index.less')

export interface StarRating {
  rating: number;
  maxStars?: number;
  style?: CSSProperties;
  iconFontSize?: string;
  className?: string;
  color?: string;
  actionLeft?: React.ReactNode;
  actionRight?: React.ReactNode;
}

class Rating extends React.Component<StarRating, any> {

  static defaultProps = {
    rating: 0,
    maxStars: 5,
    iconFontSize: '14px',
    color: '#e6e6e6',
  }

  trans = (base: number, rating: number) => {
    if (base + 1 <= rating) {
      return 'fullStar' // 全
    } else if (base + 0.5 <= rating) {
      return 'halfStar' // 半
    } else {
      return 'emptyStar' // 空
    }
  }

  getStartWidth = (rating: number, idx: number) => {
    const floor = Math.floor(rating)
    const currentIdx = idx + 1
    if (idx + 1 <= floor) {
      return '100%'
    } else if (currentIdx > rating && currentIdx < rating + 1) {
      return `${((rating - floor) * 100).toFixed(0)}%`
    } else {
      return '0'
    }
  }

  render () {
    const { rating, actionLeft, actionRight, maxStars, className, iconFontSize, ...restProps } = this.props
    let max = maxStars
    return(
      <div className={classnames(`cf_rating`, className)} {...restProps}>
        {actionLeft ? actionLeft : null}
        { [...new Array(max)].map((_ig, idx) => (
          <span key={idx} className={'cf_rating_bg_start'}>
            <Icon
              name='Allstar'
              style={{ fontSize: iconFontSize }}
            />
            <span
              className='cf_rating_front_start'
              style={
                {
                  width: this.getStartWidth(rating, idx)
                }
              }
            >
              <Icon
                name='Allstar'
                style={{ fontSize: iconFontSize }}
              />
            </span>
          </span>
        )) }
        {actionRight ? actionRight : null}
      </div>
    )
  }
}

export default Rating

import React from 'react'
import classNames from 'classnames'
import {
  PageHeader,
  PageFooter,
} from '@/pages/components'
import * as styles from './index.less'
import Proptype from 'prop-types'

const DefaultLayout = (props) => {
  return <>
    <PageHeader />
    <section className={
      classNames(styles.section, {
        [styles.section_height_1]: !props.hiddenFooter,
      })
    }>
      <div className={classNames(styles.page, { [styles.full_page]: !!props.fullPage })}>
        {
          props.children
        }
      </div>
    </section>
    {/* <PageFooter /> */}
  </>
}

DefaultLayout.propTypes = {
  fullPage: Proptype.bool,
  hiddenFooter: Proptype.bool,
  children: Proptype.any,
}

export default DefaultLayout

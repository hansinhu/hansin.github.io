import React from 'react'
import Proptypes from 'prop-types'
import {
  SimpleHeader,
} from '@/pages/components'
import * as styles from './index.less'

const SimpleLayout = ({ children }) => {
  return <>
    <SimpleHeader />
    <section className={styles.section}>
      <div className={styles.page}>
        { children }
      </div>
    </section>
  </>
}

SimpleLayout.propTypes = {
  children: Proptypes.any,
}

export default SimpleLayout

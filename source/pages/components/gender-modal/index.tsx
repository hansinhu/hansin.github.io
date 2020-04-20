/*
 * @file 性别选择弹窗
 * @Author: xinghanhu@clubfactory.com 
 * @Date: 2019-10-15 15:55:57 
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2020-04-03 16:03:32
 */

import React from 'react'
import classnames from 'classnames'
import { Modal, trace } from '@/pages/components'
import { getGender, setGender } from 'pc/tool'
import * as styles from './index.less'

export interface GenderModalProps {
  onItemClick: (gender: string) => void;
  className?: string,
  visible?: boolean,
  title?: React.ReactNode,
  gender?: string | undefined,
  onCancel?: () => void;
  femaleText?: string,
  maleText?: string,
}

interface GenderModalState {
  visible?: boolean,
}

class GenderModal extends React.Component<GenderModalProps, GenderModalState> {

  constructor (props: GenderModalProps) {
    super(props)
    this.state = {
      visible: props.visible,
    }
  }

  static defaultProps = {
    visible: false,
    title: '',
    femaleText: 'Female',
    maleText: 'Male',
    gender: '',
    onCancel: () => {},
    onItemClick: () => {},
  }

  componentDidMount () {
    const gender = getGender()
    const visible = this.props.visible
    if (visible || !['F', 'M'].includes(gender)) {
      setGender('F')
      // B2B 不需要性别弹窗
      // this.setState({ visible: true })
    }
  }

  componentWillReceiveProps (nextProps: GenderModalProps) {
    const propsVisible = this.props.visible
    const nextVisible = nextProps.visible
    const visible = this.state.visible
    if (nextVisible !== propsVisible && nextVisible !== visible) {
      // this.setState({ visible: nextProps.visible })
    }
  }

  handleItemClick = (gender: any) => {
    setGender(gender)
    this.setState({ visible: false })
    this.props.onItemClick(gender)

    trace.click({ mid: '15.1', b: { 'F': 'female', 'M': 'male' }[gender] })
  }

  render () {
    const { gender, onCancel, className, femaleText, maleText } = this.props
    const { visible } = this.state

    return <>
      {
        visible ? <Modal
          className={classnames(styles.cf_gender_modal, className)}
          title=''
          showCloseIcon={false}
          onCancel={onCancel}
          visible={visible}>
            <div>
              <div className={styles.cf_gender_title}>
                <h5 className={styles.cf_gender_h}>Select Your Gender</h5>
                <h5 className={styles.cf_gender_h}>for More Personalized Products</h5>
                <p className={styles.cf_gender_p}>You can always edit your gender in your account</p>
              </div>
              <div className={styles.cf_gender_content}>
                <div
                  onClick={() => this.handleItemClick('M')}
                  className={classnames(styles.cf_gender_item, { 'active': gender === 'M' })}>
                  <div className={classnames(styles.cf_gender_bg, styles.cf_male)}></div>
                  <div>{maleText}</div>
                </div>
                <div
                  onClick={() => this.handleItemClick('F')}
                  className={classnames(styles.cf_gender_item, { 'active': gender === 'F' })}>
                  <div className={classnames(styles.cf_gender_bg, styles.cf_female)}></div>
                  <div>{femaleText}</div>
                </div>
              </div>
            </div>
        </Modal> : null
      }
    </>
  }
}

export default GenderModal


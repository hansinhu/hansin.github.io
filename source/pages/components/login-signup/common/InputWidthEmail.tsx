import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react'
import classnames from 'classnames';

import { InputItem } from '@/pages/components'
import * as styles from './InputWidthEmail.less'

export interface InputWidthEmailProps {
  style?: CSSProperties;
  className?: string;
  isPhoneNum: boolean;
  changeFormVal: (key: string, value: string) => void;
  account: any;
  phoneCode: string | number;
  commonMailList: Array<any>;
  validAccount: () => void;
  placehodler: string;
  type: string;
}

@observer
class InputWidthEmail extends React.Component<InputWidthEmailProps, any> {

  constructor (props: InputWidthEmailProps) {
    super(props)
    this.state = {
      focus: false,
    }
  }

  render () {
    const {
      isPhoneNum,
      changeFormVal,
      account,
      phoneCode,
      commonMailList,
      validAccount,
      placehodler,
      type,
      ...restProps
    } = this.props
    const { focus } = this.state
    return <div className={styles.pc_input_select_wrap}>
      <InputItem
        placeholder={placehodler}
        type={type}
        className={classnames(styles.pc_login_input, {
          [styles.pc_login_input_isval]: focus && !account.errorMsg,
        })}
        onChange={(val: string) => { 
          changeFormVal('account', val.replace(/ /g, ''))
        }}
        onFocus={() => { this.setState({ focus: true }) }}
        onBlur={() => {
          setTimeout(() => {
            validAccount()
            this.setState({ focus: false })
          }, 300)
        }}
        label={isPhoneNum ? <span className={styles.pc_phone_lable}>+{phoneCode}</span> : null}
        value={account.value}
        errorMsg={account.errorMsg}
        {...restProps}
      />
      <div className={styles.m_select_content}>
        {
          commonMailList.length && focus && type !== 'number' ? <ul className={styles.pc_mail_list}>
            {
              commonMailList.map((mail: string) => {
                return <li
                  key={mail}
                  className={styles.pc_mail}
                  onMouseDown={() => { 
                    changeFormVal('account', mail)
                  }}
                >
                  {mail}
                </li>
              })
            }
          </ul> : null
        }
      </div>
    </div>
  }
}

export default InputWidthEmail


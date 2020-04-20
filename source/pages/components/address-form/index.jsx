import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { InputItem, Radio, Button, Select, Message, Modal, utils } from '@/pages/components'
import {
  VALIDATE_INFO,
  REGEX,
  TOAST_INFO,
  ITERMS,
} from '@/pages/components/address-form/address_manage'
import { COUNTRY_MAP } from '@/constants'
import axios from '@/setup/axios'
import URL from 'pc/constants/url'
import {
  getCountry,
  getUserInfo,
} from 'pc/tool'

import styles from './index.less'

const isSameNotDiffCase = (source = '', target = '') => {
  if (source.toLowerCase && target.toLowerCase) {
    return source.toLowerCase() === target.toLowerCase()
  } else {
    return false
  }
}

class AddressForm extends React.Component {
  static propTypes = {
    defaultAddressInfo: PropTypes.object,
    address_store: PropTypes.object,
    handleSubmitAddress: PropTypes.func,
    handleCancel: PropTypes.func,
    pincodeError: PropTypes.bool,
  }

  static defaultProps = {
    handleSubmitAddress: () => {},
    handleCancel: () => {},
  }

  constructor (props) {
    super(props)
    this.countryCode = getCountry()
    this.countryInfo = COUNTRY_MAP[this.countryCode]
    this.phoneLen = this.countryInfo.phoneLength
    this.phoneCode = this.countryInfo.phonePrefix
    this.isEdit = props.defaultAddressInfo && props.defaultAddressInfo.addrId
    const shippingTimeType = props.defaultAddressInfo?.shippingTimeType
    this.state = {
      formData: {},
      addressType: shippingTimeType,
      states: [],
    }
  }

  async componentDidMount () {
    const { pincodeError } = this.props
    const formData = await this.filterFormData()
    this.setState({
      formData,
    }, () => {
      if (this.countryCode === 'in') {
        for (let key in formData) {
          const err = this.validate(key, formData[key].val) || ''
          if (key === 'pincode' && pincodeError) {
            this.pincodeRef.focus()
          } else if (!pincodeError && key === 'flat' && this.isEdit) {
            const errorType = this.validateAddr()
            if (errorType > 3) {
              this[errorType === 6 ? 'colonyRef' : 'flatRef'].focus()
            }
          }
        }
      }
    })
  }

  validateAddr = () => {
    const { formData } = this.state
    const flat = formData.flat.val || ''
    const colony = formData.colony.val || ''
    const len = flat.length + colony.length
    const flatAndColony = flat + colony

    const isLenIllegal = isNaN(len) || len < 10
    const isContainVowel = /[aeiouAEIOU]/.test(flatAndColony)
    const isFlatAllBlank = flat.trim().length === 0
    const isColonyAllBlank = colony.trim().length === 0
    if (isLenIllegal || !isContainVowel) {
      this.setTargetPropertyVal('flat', 'errorMsg', VALIDATE_INFO.addressValid)
      this.setTargetPropertyVal('colony', 'errorMsg', VALIDATE_INFO.addressValid)
      this.flatRef.focus()
      return 1
    }

    if (isFlatAllBlank) {
      this.setTargetPropertyVal('flat', 'errorMsg', VALIDATE_INFO.addressValid)
      this.flatRef.focus()
      return 2
    }

    if (isColonyAllBlank) {
      this.setTargetPropertyVal('colony', 'errorMsg', VALIDATE_INFO.addressValid)
      this.colonyRef.focus()
      return 3
    }

    // 弱校验
    const state = formData.state.val
    const city = formData.city.val

    const isFlatSameWithCity = isSameNotDiffCase(flat, city)
    const isColonySameWithCity = isSameNotDiffCase(colony, city)
    const isFlatSameWithState = isSameNotDiffCase(flat, state)
    const isColonySameWithState = isSameNotDiffCase(colony, state)
    const isNumTooMuch = flatAndColony.replace(/[^0-9]/ig, '').length / flatAndColony.length > 0.55
    const isSuperStrTooMuch = flatAndColony.replace(/[^/\-#,.]/ig, '').length > 9
    const isSame = isSameNotDiffCase(flat, colony)
    const isNoBlank = flatAndColony.replace(/[^ ]/ig, '').length < 1
    if (isNumTooMuch || isSuperStrTooMuch || isSame || isNoBlank) {
      this.setTargetPropertyVal('flat', 'errorMsg', VALIDATE_INFO.addressWeekValid)
      this.setTargetPropertyVal('colony', 'errorMsg', VALIDATE_INFO.addressWeekValid)
      return 4
    }
    if (isFlatSameWithCity || isFlatSameWithState) {
      this.setTargetPropertyVal('flat', 'errorMsg', VALIDATE_INFO.addressWeekValid)
      return 5
    }
    if (isColonySameWithCity || isColonySameWithState) {
      this.setTargetPropertyVal('colony', 'errorMsg', VALIDATE_INFO.addressWeekValid)
      return 6
    }

    return 0
  }

  componentWillUnmount () {
    this.initItem()
  }

  /**
   * 重置表单模版字段数据
   * @memberof AddressAddEdit
   */
  initItem = () => {
    Object.keys(ITERMS).forEach((item) => {
      ITERMS[item].val = ''
      ITERMS[item].errorMsg = ''
    })
  }

  /**
   * 函数用于根据国家码配置对应表单项
   *
   * @memberof AddressAddEdit
   */
  filterFormData = async () => {
    let { name, firstName, lastName, email, phone, alternatephone, pincode, zipcode, state, province, city, flat, colony, landmark, detail, district } = ITERMS
    const defaultAddressInfo = this.props.defaultAddressInfo
    if (defaultAddressInfo && defaultAddressInfo?.addrId) {
      if (['sa', 'ae'].includes(this.countryCode)) {
        const name = defaultAddressInfo.receiver.split('**')
        firstName.val = name[0]
        lastName.val = name[1] || ''
      } else {
        name.val = defaultAddressInfo.receiver
      }
      email.val = defaultAddressInfo.email
      phone.val = defaultAddressInfo.phone
      // alternatephone
      if (['sa', 'ae', 'in'].includes(this.countryCode)) {
        alternatephone.val = defaultAddressInfo.alternatePhone
      }
      // pincode, flat, colony, landmark
      if (this.countryCode === 'in') {
        pincode.val = defaultAddressInfo.zipCode
        if (defaultAddressInfo?.ext) {
          const detail = JSON.parse(defaultAddressInfo?.ext)?.india
          flat.val = detail?.flat || ''
          colony.val = detail?.colony || ''
          landmark.val = detail ?.landmark || ''
        }
      }
      // zipcode
      if (!['in', 'sa', 'ae'].includes(this.countryCode)) {
        zipcode.val = defaultAddressInfo.zipCode
      }
      if (this.countryCode !== 'in') {
        detail.val = defaultAddressInfo.detail
      }
      // state
      if (this.countryCode === 'it') {
        province.val = defaultAddressInfo.state
      } else {
        state.val = defaultAddressInfo.state
      }
    }
    let formData = {}
    // name
    if (['sa', 'ae'].includes(this.countryCode)) {
      formData.firstName = firstName
      formData.lastName = lastName
    } else {
      formData.name = name
    }
    // email, phone
    formData.email = email
    // 如果是在新增地址，并且用户是用邮箱登录，将其设置为默认邮箱
    if (!this.isEdit) {
      const user = getUserInfo()
      formData.email.val = user.loginEmail || ''
    }
    formData.phone = {
      ...phone,
      placeholder: `${this.phoneLen} Digits ${phone.placeholder}`,
    }
    // alternatephone
    if (['sa', 'ae', 'in'].includes(this.countryCode)) {
      formData.alternatephone = {
        ...alternatephone,
        placeholder: `${this.phoneLen} Digits ${alternatephone.placeholder} (Optional)`,
      }
    }
    // pincode, flat, colony, landmark
    if (this.countryCode === 'in') {
      formData = {
        ...formData,
        pincode,
        flat,
        colony,
        landmark: {
          ...landmark,
          extra: <span className={styles.extra_style}>(Optional)</span>,
        },
      }
    }
    // zipcode
    if (!['in', 'sa', 'ae'].includes(this.countryCode)) {
      if (this.countryCode === 'it') {
        formData.zipcode = {
          ...zipcode,
          placeholder: 'CAP*',
          input_half: true,
        }
      } else {
        formData.zipcode = zipcode
      }
    }
    // state, province
    await import('pc/json/state').then(res => {
      if (this.countryCode === 'it') {
        const provinces = res.default[this.countryCode]
        this.setState({
          provinces,
        })
        formData.province = {
          ...province,
          type: 'select',
          togglePlaceholder: false,
          clearable: false,
          disabled: false,
          options: provinces,
          placeholder: 'Province*',
          title: 'Province*',
        }
      } else {
        const states = res.default[this.countryCode]
        this.setState({
          states,
        })
        formData.state = {
          ...state,
          type: 'select',
          togglePlaceholder: false,
          clearable: false,
          disabled: false,
          options: states,
          placeholder: 'State*',
          title: 'State*',
        }
      }
    })
    // city
    if (['ae', 'bh', 'sa', 'in'].includes(this.countryCode)) {
      await import('pc/json/city').then(res => {
        const cities = res.default[this.countryCode]
        this.setState({
          cities,
        })
        formData.city = {
          ...city,
          type: 'select',
          togglePlaceholder: false,
          clearable: false,
          disabled: false,
          options: [],
          placeholder: 'City*',
          title: 'City*',
        }
        if (this.isEdit) {
          const states = this.state.states
          const state = states.filter(data => {
            return data.label === defaultAddressInfo.state
          })
          if (state.length) {
            formData.city.val = defaultAddressInfo.city
            formData.city.options = state[0].city
          }
        }
      })
    } else {
      formData.city = {
        ...city,
        val: defaultAddressInfo?.city || '',
        togglePlaceholder: true,
        clearable: true,
        disabled: false,
      }
    }

    // district
    if (this.countryCode === 'sa') {
      await import('pc/json/district').then(res => {
        const districts = res.default[this.countryCode]
        this.setState({
          districts,
        })
        formData.district = {
          ...district,
          type: 'select',
          togglePlaceholder: false,
          clearable: false,
          disabled: false,
          options: [],
          placeholder: 'District*',
          title: 'District*',
        }
        if (this.isEdit && defaultAddressInfo.city) {
          const districts = this.state.districts
          const district = districts[defaultAddressInfo.city]
          formData.district.val = defaultAddressInfo.district
          formData.district.options = district || []
        }
      })
    }
    // detail
    if (this.countryCode !== 'in') {
      formData.detail = detail
    }
    return formData
  }

  /**
   * 设置formdata中指定key值某个属性值
   *
   * @memberof AddressAddEdit
   * @param formdata中key值
   * @param formdata[key]对象中某个属性值
   * @param formdata[key]对象中某个属性值要赋的值
   */
  setTargetPropertyVal = (key, property, val) => {
    const formData = this.state.formData
    const param = Object.assign(formData[key], {
      [property]: val,
    })
    this.setState({
      formData: {
        ...formData,
        ...{
          [key]: param,
        },
      },
    })
  }

  /**
   * 部分需要引起注意的校验：
   * name: 正则校验需要取反处理
   * alternatephone选填，有值就必须做校验
   * detail, district，flat, colony, landmark这几个字段是取反校验，当正则匹配不通过时输入正确, landmark有值必须做校验
   *
   * @param key指定校验键
   * @param val指定校验值
   *  */
  validate = (key = '', val = '') => {
    const phoneLen = COUNTRY_MAP[this.countryCode].phoneLength
    const phoneError = `Please enter a valid ${phoneLen} digits phone number.`
    const paramVal = val.trim() // 校验表单输入，先去除首尾空格
    let err = ''
    if (['firstName', 'lastName', 'name'].includes(key)) {
      if (paramVal === '') return VALIDATE_INFO['name'];
      if (!/^[^*0-9]+$/g.test(paramVal)) {
        return VALIDATE_INFO['name2'];
      }
    } else if (key === 'phone') {
      // phone需要根据国家校验不同的长度
      err = val.length !== phoneLen ? phoneError : ''
    } else if (key === 'alternatephone') {
      // phone需要根据国家校验不同的长度
      err = paramVal && val.length !== phoneLen ? phoneError : ''
    } else if (key === 'zipcode') {
      const regex = new RegExp(COUNTRY_MAP[this.countryCode].zip_info)
      // zipcode是必填项
      if (!regex.test(val) || !val) {
        err = `${COUNTRY_MAP[this.countryCode].zipTips}`
      }
    } else if (REGEX[key] && !REGEX[key].test(paramVal)) {
      err = VALIDATE_INFO[key]
    }

    return err
  }

  handleAddrValidateBeforeConfirm = () => {
    if (this.countryCode === 'in') {
      const errorType = this.validateAddr()
      switch (errorType) {
        case 1:
        case 2:
        case 3:
          return
        case 4:
        case 5:
        case 6:
          let isShowed = false
          const addrId = this.props.defaultAddressInfo.addrId
          const stringify = JSON.stringify
          const setItem = localStorage.setItem.bind(localStorage)
          if (addrId) {
            const SHOWED_STR = localStorage.getItem('SHOWED_ADDRESS_ALERT')
            if (SHOWED_STR) {
              const SHOWED_LIST = JSON.parse(SHOWED_STR)
              if (Array.isArray(SHOWED_LIST)) {
                if (SHOWED_LIST.includes(addrId)) {
                  isShowed = true
                } else {
                  setItem('SHOWED_ADDRESS_ALERT', stringify(SHOWED_LIST.concat([addrId])))
                }
              } else {
                setItem('SHOWED_ADDRESS_ALERT', stringify([addrId]))
              }
            } else {
              setItem('SHOWED_ADDRESS_ALERT', stringify([addrId]))
            }
          }
          // if (!isShowed) {
          Modal.Confirm({
            okText: 'Deliver to this address',
            cancelText: 'Edit address',
            content: <div>
              <h4 className={styles.my_confrim_title}>Incorrect or incomplete address</h4>
              <p>Please correct your address or proceed if you are sure it is correct.</p>
            </div>,
            onCancel: () => this[errorType === 6 ? 'colonyRef' : 'flatRef'].focus(),
            onOk: this.handleConfirm,
          })
          return
          // } else {
          //   this.handleConfirm()
          // }
      }
    }
    this.handleConfirm()
  }

  // 由于校验是异步的，这里用promise执行每一个表单
  handleConfirm = () => {
    console.log('---handleConfirm', utils.getQuery())
    const { formData } = this.state
    let errBag = {}
    for (let key in formData) {
      const err = this.validate(key, formData[key].val) || ''
      if (err) {
        errBag[key] = err
      }
      this.setTargetPropertyVal(key, 'errorMsg', err)
    }
    const isValidate = !Object.keys(errBag).length
    if (isValidate) {
      // 如果没有错误信息，则向上传递
      const params = this.refactorFormData()
      if (this.isEdit) {
        axios.put(URL.editAddress, params).then((res) => {
          const result = res?.data?.data
          if (result) {
            this.props.handleSubmitAddress(result)
          } else {
            let message = res?.data?.message
            message && Message.error(message, 2000)
          }
        }).catch(err => {
          let error_message = err?.response?.data?.message || TOAST_INFO.netWork
          Message.error(error_message, 2000)
        })
      } else {
        axios.post(URL.addAddress, params).then((res) => {
          const result = res?.data?.data
          if (result) {
            this.props.handleSubmitAddress(result)
          } else {
            let message = res?.data?.message
            message && Message.error(message, 2000)
          }
        }).catch(err => {
          let error_message = err?.response?.data?.message || TOAST_INFO.netWork
          Message.error(error_message, 2000)
        })
      }
    }
  }

  /**
   * 组装表单数据用于请求新增/编辑接口
   * 注意：不同国家有些字段需要做特殊处理
   *
   * @memberof AddressAddEdit
   */
  refactorFormData = () => {
    const {
      formData,
      addressType,
    } = this.state
    const {
      name,
      firstName,
      lastName,
      email,
      phone,
      alternatephone,
      pincode,
      zipcode,
      state,
      province,
      city,
      flat,
      colony,
      landmark,
      detail,
      district,
    } = formData

    // 所有国家都需要的入参
    let params = {
      receiver: ['sa', 'ae'].includes(this.countryCode) ? `${firstName.val} ${lastName.val}` : name.val,
      send_type: addressType, // 0 home 1 office
      is_default: 1,
      phone: phone.val,
      email: email.val,
      state_id: 0, // 后端接口限制，此key值必须存在，同时，需要为int类型
      state: this.countryCode === 'it' ? province.val : state.val,
      city: city.val,
      country_name: this.countryInfo.name,
    }
    if (this.countryCode !== 'in') {
      const state = this.state.states.filter(item => {
        if (item.label === params.state) {
          return item
        }
      })
      if (state.length) {
        params.state_id = `${state[0].value}`
      }
    }
    if (this.isEdit) {
      const defaultAddressInfo = this.props.defaultAddressInfo
      params.addr_id = defaultAddressInfo?.addrId || ''
    }
    params.detail = this.countryCode !== 'in' ? detail.val : ''
    params.ext = this.countryCode !== 'in' ? '' : JSON.stringify({
      india: {
        landmark: landmark.val,
        flat: flat.val,
        colony: colony.val,
      },
    })
    // 印度、沙特、阿联酋有备用电话
    params.alternate_phone = ['in', 'sa', 'ae'].includes(this.countryCode) ? alternatephone.val : ''
    params.district = this.countryCode === 'sa' ? district.val : ''
    // zipcode: 阿联酋，阿拉伯以外国家必填, 印度实际值用pincode传入
    params.zip_code = !['sa', 'ae'].includes(this.countryCode) ? this.countryCode === 'in' ? pincode.val : zipcode.val : ''
    return params
  }

  onClickBack = () => {
    history.go(-1)
  }

  showToast = (key) => {
    if (this.countryCode === 'in' && ['state', 'city'].includes(key)) {
      Message.info(TOAST_INFO['stateOrcity'])
    }
  }

  onSelectChange = (val, key, optionConfCb) => {
    this.setTargetPropertyVal(key, 'val', val)
    if (key === 'state') {
      // 当state值改变时，如果是ae，bh，sa这些国家，对应的city值需要根据当前选中的国家重置
      if (['ae', 'bh', 'sa', 'in'].includes(this.countryCode)) {
        this.setTargetPropertyVal('city', 'val', '')
        if (this.countryCode === 'sa') {
          this.setTargetPropertyVal('district', 'val', '')
          this.setTargetPropertyVal('district', 'options', [])
        }
        // 获取当前选中state下的cities
        let cityArray = []
        this.state.states.forEach((state) => {
          console.log(state.label, val, state.label === val)
          if (state.label === val) {
            cityArray = state.city
          }
        })
        console.log(cityArray)
        if (cityArray.length) {
          this.setTargetPropertyVal('city', 'options', cityArray)
        }
      }
      if (optionConfCb) optionConfCb()
    } else if (key === 'city') {
      // 当city改变，如果是sa，对应district值需要根据city值重置
      if (this.countryCode === 'sa') {
        this.setTargetPropertyVal('district', 'val', '')
        let districtArray = []
        districtArray = this.state.districts[val].length ? this.state.districts[val] : []
        this.setTargetPropertyVal('district', 'options', districtArray)
      }
    }
  }

  onChange = (key = '', val = '') => {
    // 控制手机号输入长度
    const zipcodeLen = COUNTRY_MAP[this.countryCode].maxlength
    const mapKeyToLen = {
      phone: this.phoneLen,
      alternatephone: this.phoneLen,
      pincode: 6, // 只有印度才会有pincode
      name: 50,
      zipcode: zipcodeLen,
    }
    val = mapKeyToLen[key] ? val.slice(0, mapKeyToLen[key]) : val
    this.setTargetPropertyVal(key, 'val', val)
  }

  onFocus = (key = '') => {
    // this.setTargetPropertyVal(key, 'errorMsg', '')

    // 如果flat和colony两个字段长度和小于10，就提示错误
    // if (['flat', 'colony'].includes(key)) {
    //   const extrkey = key === 'flat' ? 'colony' : 'flat'
    //   this.setTargetPropertyVal(extrkey, 'errorMsg', '')
    // }
  }

  onInput = (key = '', val = '') => {
    // 改动点：当flat或者colony失去焦点时，如果是地址不完善的错误的情况下，另一个字段的errorMsg要清空
    if (['flat', 'colony'].includes(key)) {
      const { formData } = this.state
      const extrKey = key === 'flat' ? 'colony' : 'flat'
      if ([VALIDATE_INFO.addressValid, VALIDATE_INFO.addressWeekValid].includes(formData[extrKey].errorMsg)) {
        this.setTargetPropertyVal(key, 'errorMsg', '')
        this.setTargetPropertyVal(extrKey, 'errorMsg', '')
      }
    }
  }

  /**
   *
   *
   * @memberof AddressAddEdit
   * 输入框光标聚焦，部分国家需要做特殊处理
   * in: pincode需要与state，city联动,当pincode校验通过时，需要请求pincode接口，自动填充state和city
   */
  onBlur = (key = '', val = '') => {
    // 改动点：当flat或者colony失去焦点时，如果是地址不完善的错误的情况下，另一个字段的errorMsg要清空
    // if (['flat', 'colony'].includes(key)) {
    //   const { formData } = this.state
    //   const extrKey = key === 'flat' ? 'colony' : 'flat'
    //   if ([VALIDATE_INFO.addressValid, VALIDATE_INFO.addressWeekValid].includes(formData[extrKey].errorMsg)) {
    //     this.setTargetPropertyVal(key, 'errorMsg', '')
    //     this.setTargetPropertyVal(extrKey, 'errorMsg', '')
    //   }
    // }

    const err = this.validate(key, val)
    if (err) {
      this.setTargetPropertyVal(key, 'errorMsg', err)
      return
    }
    this.setTargetPropertyVal(key, 'errorMsg', '')
    if (this.countryCode === 'in' && key === 'pincode') {
      const params = {
        // pincode: val,
        // country_id: this.countryInfo.id,
        zipCode: val,
      }
      axios.get(URL.pincode, { params }).then((res) => {
        if (res?.data?.body?.stateName && res?.data?.body?.cityName) {
          // pincode请求成功，设置state，city值，同时清空对应报错
          // 通过 onSelectChange 触发 city option 更新
          this.onSelectChange(res.data.body.stateName, 'state', () => { this.onSelectChange(res.data.body.cityName, 'city') })
          this.setTargetPropertyVal('state', 'errorMsg', '')
          this.setTargetPropertyVal('city', 'errorMsg', '')
        } else {
          this.setTargetPropertyVal('pincode', 'errorMsg', VALIDATE_INFO.pincode2)
        }
      }).catch(err => {
        let error_message = err?.response?.data?.message || TOAST_INFO.netWork
        Message.error(error_message, 2000)
      })
    }
  }

  changeAddressType = (e) => {
    const value = e.target.value || '0'
    this.setState({
      addressType: Number(value),
    })
  }

  getInputLabel = (name) => {
    return ['phone', 'alternatephone'].includes(name) ? `+${this.phoneCode} -` : undefined
  }

  getInputExtra = (name) => {
    if (name === 'state' && this.countryCode === 'in') {
      return <span className={styles.input_extra}>State is linked with Pincode</span>
    } else if (name === 'city' && this.countryCode === 'in') {
      return <span className={styles.input_extra}>City is linked with Pincode</span>
    } else {
      return undefined
    }
  }

  checkDisableItem = (item) => {
    // if (item.disabled) {
    //   if (this.countryCode === 'in') {
    //     this.setTargetPropertyVal('pincode', 'errorMsg', `Please enter pincode.State and City will be automatically filled in`)
    //   }
    // }
    if (['bh', 'ae'].includes(this.countryCode) && item.name === 'city' && !item.options?.length) {
      this.setTargetPropertyVal('city', 'errorMsg', 'Please select state first')
    }
  }

  getFormItem = (item, index) => {
    const margin_input = ['alternatephone', 'city']
    // select类型state，city，district值格式不一致，需要区别处理
    if (item.type === 'select') {
      let options = item.options || []
      const key = item.name
      // 当key为state或者province时，需要重组下拉框options值
      if (['state', 'province'].includes(key)) {
        options = options.map(op => {
          return {
            label: op.label,
            value: op.label,
          }
        })
      } else {
        options = options.map(op => {
          return {
            label: op,
            value: op,
          }
        })
      }
      return <Select
        key={index}
        placeholder={item.placeholder}
        title={item.title}
        defaultValue={''}
        value={item.val}
        togglePlaceholder={true}
        name={item.name}
        errorMsg={item.errorMsg}
        clearable={false}
        disabled={false}
        options={options}
        onChange={(val) => this.onSelectChange(val, key)}
        className={classNames({
          [styles.margin_start]: margin_input.includes(item.name) || item.input_half,
        })}
      />
    } else {
      // 默认表单类型为text
      return <InputItem
        togglePlaceholder
        placeholder={item.placeholder}
        ref={ref => {
          if (item.name === 'pincode') {
            this.pincodeRef = ref
          }
          if (item.name === 'flat') {
            this.flatRef = ref
          }
          if (item.name === 'colony') {
            this.colonyRef = ref
          }
        }}
        onChange={(val) => this.onChange(item.name, val)}
        onFocus={(val) => this.onFocus(item.name, val)}
        onBlur={(val) => this.onBlur(item.name, val)}
        onInput={(val) => this.onInput(item.name, val)}
        value={item.val}
        type={item.type || 'text'}
        name={item.name}
        errorMsg={item.errorMsg}
        clearable={item.clearable || true}
        disabled={item.disabled || false}
        label={this.getInputLabel(item.name)}
        extra={this.getInputExtra(item.name)}
        className={classNames({
          [styles.margin_start]: margin_input.includes(item.name) || item.input_half,
        })}
      />
    }
  }

  render () {
    const { addressType } = this.state
    const half_input = ['phone', 'alternatephone', 'state', 'province', 'city']

    return <div className={styles.adress_form}>
      <div className={styles.form_content}>
        {
          Object.keys(this.state.formData).map((key, index) => {
            const item = this.state.formData[key]
            return <div
              key={index}
              onClick={() => { this.checkDisableItem(item) }}
              className={classNames(
                styles.input_item,
                {
                  [styles.inline_input]: half_input.includes(item.name) || item.input_half,
                }
              )}
            >
              {
                this.getFormItem(item, index)
              }
            </div>
          })
        }
        <div className={classNames(styles.input_item, styles.inline_input_2, styles.inline_input_country)}>
          <InputItem
            placeholder='Country'
            defaultValue={COUNTRY_MAP[this.countryCode].name}
            togglePlaceholder={true}
            type='text'
            name='countryCode'
            disabled={true}
            extra={<span className={styles.input_extra}>Change country on home page</span>}
          />
        </div>
      </div>
      <div className={styles.ship_type}>
        <div className={styles.title_2}>Address Type</div>
        <div className={styles.ship_t_list}>
          <div>
            <Radio onChange={this.changeAddressType} value={0} checked={ addressType === 0}>
              <div className={styles.radio_text}>Home <span className={styles.radio_tip}>(Deliver 7am-9pm,all days)</span></div>
            </Radio>
          </div>
          <div>
            <Radio onChange={this.changeAddressType} value={1} checked={ addressType === 1}>
              <div className={styles.radio_text}>Office <span className={styles.radio_tip}>(Deliver 10am-9pm,Monday to Friday)</span></div>
            </Radio>
          </div>
        </div>
      </div>
      {
        this.isEdit
          ? <>
          <Button
            onClick={this.handleAddrValidateBeforeConfirm}
            style={{ width: '260px' }}
            size='lg'>Confirm</Button>
          <Button
            type='white'
            onClick={this.props.handleCancel}
            className={styles.address_cancel_btn}
            style={{ width: '260px' }} size='lg'>Cancel</Button>
          </>
          : <Button onClick={this.handleAddrValidateBeforeConfirm} style={{ width: '260px' }} size='lg'>Deliver Here</Button>
      }
    </div>
  }
}
export default AddressForm

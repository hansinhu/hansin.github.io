/*
 * @Author: xinghanhu@clubfactory.com
 * @Date: 2019-07-02 15:42:14
 * @Last Modified by: xinghanhu@clubfactory.com
 * @Last Modified time: 2019-08-21 20:39:53
 */
export const TOAST_INFO = {
  stateOrcity: 'Please enter pincode.State and City will be automatically filled in',
  netWork: 'network error',
}
export const VALIDATE_INFO = {
  name: 'Please enter a name for this address.',
  name2: 'Digit and * are not allowed.',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a valid 10 digits phone number.',
  alternatephone: 'Please enter a valid 10 digits phone number.',
  pincode: 'Please enter a valid 6 digits pincode.',
  pincode2: "We currently don't deliver here. Please check your pincode.",
  state: 'Please supply a valid state for this address.',
  city: 'Please supply a valid city for this address.',
  flat: 'Please enter a valid address in English.',
  colony: 'Please enter a valid address in English.',
  landmark: 'Please enter a valid address in English.',
  detail: 'Please enter a valid address in English.',
  province: 'Please enter a valid address in English.',
  district: 'Please supply a valid district for this address.',
  addressValid: 'Insufficient address, please add more details',
  addressWeekValid: 'Incorrect or incomplete address, please check it.',
}

export const REGEX = {
  name: /^[^*0-9]+$/g,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  phone: /^(\d){10}$/,
  alternatephone: /^(\d){10}$/,
  pincode: /^(\d){6}$/,
  state: /\S+/,
  city: /\S+/,
  province: /\S+/,
  district: /\S+/,
  flat: /^[0-9a-zA-Z,.#/-\s]{1,200}$/,
  colony: /^[0-9a-zA-Z,.#/-\s]{1,200}$/,
  landmark: /^[0-9a-zA-Z,.#/-\s]{0,200}$/,
  detail: /^[0-9a-zA-Z,.#/-\s]{1,200}$/,
}

export const ITERMS = {
  name: {
    name: 'name',
    val: '',
    placeholder: 'Name*',
    errorMsg: '',
  },
  firstName: {
    name: 'firstName',
    val: '',
    placeholder: 'First Name*',
    errorMsg: '',
  },
  lastName: {
    name: 'lastName',
    val: '',
    placeholder: 'Last Name*',
    errorMsg: '',
  },
  email: {
    name: 'email',
    val: '',
    placeholder: 'Email*',
    errorMsg: '',
  },
  phone: {
    name: 'phone',
    val: '',
    placeholder: 'Phone Number*',
    errorMsg: '',
    type: 'number',
  },
  alternatephone: {
    name: 'alternatephone',
    val: '',
    placeholder: 'Alternate Phone',
    errorMsg: '',
    type: 'number',
  },
  pincode: {
    name: 'pincode',
    val: '',
    placeholder: '6 Digits Pincode*',
    errorMsg: '',
    type: 'number',
  },
  zipcode: {
    name: 'zipcode',
    val: '',
    placeholder: 'Zip Code*',
    errorMsg: '',
    type: 'number',
  },
  state: {
    name: 'state',
    val: '',
    placeholder: 'State*',
    errorMsg: '',
  },
  province: {
    name: 'province',
    val: '',
    placeholder: 'Province*',
    errorMsg: '',
  },
  city: {
    name: 'city',
    val: '',
    placeholder: 'City*',
    errorMsg: '',
  },
  flat: {
    name: 'flat',
    val: '',
    placeholder: 'Flat/House No./Floor/Building*',
    errorMsg: '',
  },
  colony: {
    name: 'colony',
    val: '',
    placeholder: 'Colony/Street/Locality*',
    errorMsg: '',
  },
  landmark: {
    name: 'landmark',
    val: '',
    placeholder: 'Landmark: Near/Behind',
    errorMsg: '',
  },
  detail: {
    name: 'detail',
    val: '',
    placeholder: 'Address Detail (in English)*',
    errorMsg: '',
  },
  district: {
    name: 'district',
    val: '',
    placeholder: 'district*',
    errorMsg: '',
  },
}

export default {
  TOAST_INFO,
  VALIDATE_INFO,
  REGEX,
  ITERMS,
}

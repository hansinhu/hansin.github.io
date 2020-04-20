
/**
* @file LazyImage.jsx
* @Synopsis 图片懒加载、代理
* @author 徐敏辉
* @date 2019-07-05
* @flow
*/
import React, { useState, useMemo } from 'react'
import loading from './load.png'

type LazyImgProps = {
  src: string,
  style: Object,
  className: string,
  onLoad: () => void,
}

function LazyImg (props: LazyImgProps) {
  const [imageUrl, setImage] = useState(loading) // eslint-disable-line
  // 缓存一份Image
  const image = useMemo(() => {
    const i = new Image()
    i.src = props.src
    return i
  }, [props.src])

  image.onerror = (e) => {
    console.log(e)
    // TODO: 图片载入出错
  }

  image.onload = (_ele) => {
    // TODO: 图片载入成功
    setImage(props.src)
    props.onLoad && props.onLoad()
  }

  return <img style={props.style} className={props.className} src={imageUrl}/>
}

export default LazyImg

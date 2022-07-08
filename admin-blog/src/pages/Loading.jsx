import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import style from '../css/Loading.module.css'

function Loading() {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <div className={style['horizontal-vertical-center']}>
    <Spin indicator={antIcon} /></div>
  )
}

export default Loading
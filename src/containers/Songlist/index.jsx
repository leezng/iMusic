import React from 'react'
import { getSonglist, getSonglistDetail, setPlaylist, setPlaying } from 'src/actions'
import { List, Icon } from 'antd'
import { connectListHoc } from '../ListHoc'
import "./index.less"

function ListItemRender (item, dispatch) {
  return <List.Item extra={<Icon className="play" type="play-circle-o" onClick={() => {
    if (!item.detail) {
      dispatch(getSonglistDetail(item.id))
    } else {
      let playlist = item.detail.tracks || []
      dispatch(setPlaylist(playlist))
      dispatch(setPlaying(playlist[0]))
    }
  }} />}>
    <List.Item.Meta
      title={item.name}
      description={<img width={200} alt="无法获取图片" src={item.picUrl} />} />
  </List.Item>
}

export default connectListHoc({
  className: 'songlist',
  stateName: 'songlist',
  getAllData: getSonglist
}, ListItemRender)

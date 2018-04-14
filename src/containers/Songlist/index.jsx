import { getSonglist, getSonglistDetail, setPlaylist, setPlaying } from 'src/actions'
import { connectListHoc } from '../ListHoc'

export default connectListHoc({
  className: 'songlist',
  stateName: 'songlist',
  getAllData: getSonglist,
  playIcon: true,
  itemOnClick: (item, props) => {
    const { dispatch } = props
    if (!item.detail) {
      dispatch(getSonglistDetail(item.id))
    } else {
      let playlist = item.detail.tracks || []
      dispatch(setPlaylist(playlist))
      dispatch(setPlaying(playlist[0]))
    }
  }
})

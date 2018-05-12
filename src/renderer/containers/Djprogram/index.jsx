import { getDjprogram, addToPlaylist, setPlaying } from 'renderer/actions'
import { connectListHoc } from '../ListHoc'

export default connectListHoc({
  className: 'djprogram',
  stateName: 'djprogram',
  getAllData: getDjprogram,
  playIcon: true,
  itemOnClick: (item, props) => {
    const { dispatch } = props
    let song = item && item.program && item.program.mainSong
    if (!song) return
    dispatch(addToPlaylist(song)) && dispatch(setPlaying(song))
  }
})

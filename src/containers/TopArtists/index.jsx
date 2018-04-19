import { getTopArtists, getArtistDetail } from 'src/actions'
import { connectListHoc } from '../ListHoc'
import './index.less'

export default connectListHoc({
  className: 'top-artists',
  stateName: 'artists',
  getAllData: getTopArtists,
  itemOnClick: (item, props) => {
    const { dispatch, history } = props
    dispatch(getArtistDetail(item.id))
    history.push(`artistDetail/${item.id}`)
  }
})

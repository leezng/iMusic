import { getTopArtists } from 'src/actions'
import { connectListHoc } from '../ListHoc'
import "./index.less"

export default connectListHoc({
  className: 'top-artists',
  stateName: 'topArtists',
  getAllData: getTopArtists
})

import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { List } from 'antd'
import "./index.less"

/**
 * 列表高阶组件
 * @param  {String} options.className  样式类名
 * @param  {String} options.stateName  store的对应数据字段
 * @param  {function} options.getAllData 获取数据源
 * @param  {function} options.itemOnClick [可选]单项点击事件, 提供参数(item, props),
 *                                        若存在ListItemRender则无效
 * @param  {function} ListItemRender [可选]用于自定义列表单项元素结构, 接收参数(item, dispatch)
 */
export function connectListHoc({
  className,
  stateName,
  getAllData,
  itemOnClick
}, ListItemRender) {
  const mapStateToProps = (state, ownProps) => ({
    [stateName]: state[stateName]
  })

  class WithList extends Component {
    static propTypes = {
      isActive: PropTypes.bool // 当前Tab是否活动中
    }

    static defaultProps = {
      isActive: false
    }

    state = {
      pageNo: 1,
      pageSize: 12
    }

    hanldeOnChange = (pageNo, pageSize) => {
      this.setState({
        pageNo
      })
    }

    request = () => {
      const { dispatch, isActive } = this.props
      const { status, result } = this.props[stateName]
      if (status === 'pending') return
      if (isActive && (!result || !result.length)) {
        // console.log('ListHoc request dispatch')
        dispatch(getAllData())
      }
    }

    componentDidMount () {
      // console.log('componentDidMount')
      this.request()
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.isActive === this.props.isActive) return
      console.log('componentWillReceiveProps: ', nextProps)
      this.request()
    }

    getCurrentData = (pageSize, pageNo, allData = []) => {
      let arr = []
      let indexStart = pageSize * (pageNo - 1) // 1 => 0, 2 => 10, 3 => 20
      while (pageSize-- && allData[indexStart]) {
        arr.push(allData[indexStart++])
      }
      return arr
    }

    render () {
      const { pageSize, pageNo } = this.state
      let { status, result } = this.props[stateName]
      if (Array.isArray(result) && stateName === 'artists') {
        result = result.filter(item => item && item.isTop) // 只获取歌手榜
      }
      return <List
        className={`list-hoc ${className}`}
        grid={{ gutter: 20, column: 6 }}
        loading={status === 'pending'}
        dataSource={this.getCurrentData(pageSize, pageNo, result)}
        pagination={{
          pageSize: pageSize,
          current: pageNo,
          total: result && result.length,
          size: 'small',
          onChange: this.hanldeOnChange,
        }}
        renderItem={item => {
          return typeof ListItemRender === 'function'
            ? ListItemRender(item, this.props.dispatch)
            : <List.Item>
              <List.Item.Meta
                title={item.name}
                description={<img width={200} alt="无法获取图片" src={item.picUrl} />}
                onClick={() => itemOnClick(item, this.props)} />
            </List.Item>
        }}
      />
    }
  }

  return withRouter(connect(mapStateToProps)(WithList))
}

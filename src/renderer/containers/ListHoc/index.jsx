import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { List, Icon } from 'antd'
import { getObjectValue } from 'renderer/utils'
import './index.less'

/**
 * 列表高阶组件(只适用于获取所有数据的情况, 不支持分页请求数据)
 * @param  {String} options.className  样式类名
 * @param  {String} options.stateName  store的对应数据字段(支持key.abc.cc的写法), 对应数据是Object或Array
 *                                     Object: 数据包含{status, result}
 *                                     Array: 纯数据, 无status
 * @param  {function} options.getAllData 获取数据源, 必须返回promise, 且code=200表示成功
 * @param  {Boolean} options.playIcon  悬浮时是否出现播放按钮
 *
 * @param  {function} options.itemOnClick [可选]单项点击事件, 提供参数(item, props),
 *                                        若存在ListItemRender则无效
 * @param  {function} ListItemRender [可选]用于自定义列表单项元素结构, 接收参数(item, dispatch)
 */
export function connectListHoc ({
  className,
  stateName,
  playIcon = false,
  getAllData,
  itemOnClick
}, ListItemRender) {
  const mapStateToProps = (state, ownProps) => ({
    [stateName]: getObjectValue(state, stateName) // 支持a.b.c写法
  })

  class WithList extends Component {
    static propTypes = {
      isActive: PropTypes.bool // 当前Tab是否活动中
    }

    static defaultProps = {
      isActive: false
    }

    state = {
      fetching: false,
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
      let data = this.props[stateName]
      let result = Array.isArray(data) ? data : data.result // 数据
      if (this.state.fetching) return
      if (isActive && (!result || !result.length)) {
        this.setState({fetching: true})
        dispatch(getAllData()).then(res => {
          if (res.code !== 200) {
            console.log('warning 没有成功获取到数据')
          }
          this.setState({fetching: false})
        }).catch(err => {
          console.warn(err)
          this.setState({fetching: false})
        })
      }
    }

    componentDidMount () {
      // console.log('componentDidMount')
      this.request()
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.isActive === this.props.isActive) return
      // console.log('componentWillReceiveProps: ', nextProps)
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
      const { fetching, pageSize, pageNo } = this.state
      let data = this.props[stateName]
      let result = Array.isArray(data) ? data : data.result // 数据
      if (Array.isArray(result) && stateName === 'artists') {
        result = result.filter(item => item && item.isTop) // 只获取歌手榜
      }
      return <List
        className={`list-hoc ${playIcon ? 'list-hoc-with-playicon' : ''} ${className}`}
        grid={{ gutter: 20, column: 6 }}
        loading={fetching}
        dataSource={this.getCurrentData(pageSize, pageNo, result)}
        pagination={{
          pageSize: pageSize,
          current: pageNo,
          total: result && result.length,
          size: 'small',
          onChange: this.hanldeOnChange,
          hideOnSinglePage: true
        }}
        renderItem={item => {
          // playIcon存在时, 事件绑定在ListItem, 否则绑定在ListItemMeta
          let ItemProps = playIcon ? {
            extra: <Icon className="play" type="play-circle-o" />,
            onClick: () => itemOnClick(item, this.props)
          } : {}
          let metaProps = {
            title: item.name,
            description: <img width={200} alt="无法获取图片" src={item.picUrl} />
          }
          if (!playIcon) metaProps.onClick = () => itemOnClick(item, this.props)
          return typeof ListItemRender === 'function'
            ? ListItemRender(item, this.props.dispatch)
            : <List.Item {...ItemProps}>
              <List.Item.Meta {...metaProps} />
            </List.Item>
        }}
      />
    }
  }

  return withRouter(connect(mapStateToProps)(WithList))
}

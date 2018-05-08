import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Icon } from 'antd'
import './index.less'

class TitleBar extends Component {
  /**
   * 路由控制函数, 前进, 后退
   * @param  {Number} step 步数: 1, -1, ...
   */
  go = (step) => {
    const { history } = this.props
    history.go(step)
  }

  render () {
    return <div className="title-bar">
      <div className="common">
        <Icon type="left" onClick={() => this.go(-1)} />
        <Icon type="right" onClick={() => this.go(1)} />
      </div>
      <div className="win-controller">
      </div>
    </div>
  }
}

export default withRouter(TitleBar)

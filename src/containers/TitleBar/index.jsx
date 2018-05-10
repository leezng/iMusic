import { remote } from 'electron'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Icon } from 'antd'
import './index.less'

const win = remote.getCurrentWindow()

let isWin
try {
  // 阻止web版报错
  isWin = process.platform === 'win32'
} catch (e) {}

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
      {(() => {
        if (!isWin) return null
        return <div className="win-controller" style={{display: isWin ? '' : 'none'}}>
          <Button icon="minus" size="small" onClick={() => win.minimize()}></Button>
          <Button icon="close" size="small" onClick={() => win.close()}></Button>
        </div>
      })()}
    </div>
  }
}

export default withRouter(TitleBar)

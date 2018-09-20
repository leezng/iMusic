import { remote, shell } from 'electron'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Icon, Modal } from 'antd'
import './index.less'
import pkgInfo from '@/package.json'

function showInfo () {
  Modal.info({
    title: `${pkgInfo.name} - ${pkgInfo.version}`,
    content: (
      <div>
        <div>本项目仅供技术交流使用，禁止用于商业用途</div>
        <div>Copyright 2018 <a onClick={() => shell.openExternal('https://github.com/leezng/iMusic')}>leezng</a></div>
      </div>
    )
  })
}

class TitleBar extends Component {
  /**
   * 路由控制函数, 前进, 后退
   * @param  {Number} step 步数: 1, -1, ...
   */
  go = (step) => {
    const { history } = this.props
    history.go(step)
  }

  openSetting = () => {
    const { history } = this.props
    history.push('/setting')
  }

  render () {
    const win = remote.getCurrentWindow()
    const isWin = process.platform === 'win32'
    return <div className="title-bar">
      <div className="common">
        <Icon type="left" onClick={() => this.go(-1)} />
        <Icon type="right" onClick={() => this.go(1)} />
        <Icon type="setting" onClick={this.openSetting} />
        <Icon type="copyright" onClick={showInfo} />
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

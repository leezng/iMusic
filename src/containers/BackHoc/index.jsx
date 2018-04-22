import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Icon } from 'antd'

/**
 * 带返回按钮的高阶组件
 * @param  {Componen} WrappedComponent  内嵌组件
 */
export function connectBackHoc (WrappedComponent) {
  class WithBack extends Component {
    back = () => {
      const { history } = this.props
      history.go(-1)
    }

    render () {
      return <div className="back-hoc">
        <Icon type="arrow-left" onClick={this.back} />
        <WrappedComponent {...this.props} />
      </div>
    }
  }

  return withRouter(WithBack)
}

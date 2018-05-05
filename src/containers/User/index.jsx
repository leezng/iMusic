import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Alert, Avatar, Button, Modal, Card, Form, Input, Icon, Popover, message } from 'antd'
import { phoneLogin, refreshLogin, setLocalUser } from 'src/actions'
import { getCookie, setCookie, deleteCookie } from 'src/utils'
import './index.less'

const FormItem = Form.Item

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

function UserAvatar ({profile, onClick}) {
  return <div className="avatar" onClick={onClick}>{(() => (
    profile && profile.userId
      ? <Avatar
        size="large"
        src={profile.avatarUrl} />
      : <span>Local</span>
  ))()}</div>
}

function LoginForm ({props}) {
  const { getFieldDecorator } = props.form
  return <Form>
    <FormItem extra="*目前仅支持使用手机号码登录">
      {getFieldDecorator('phone', {
        rules: [{ required: true, message: '请输入手机号码' }]
      })(
        <Input
          prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="手机号码" />
      )}
    </FormItem>
    <FormItem>
      {getFieldDecorator('password', {
        rules: [{ required: true, message: '请输入密码' }]
      })(
        <Input
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password" placeholder="密码" />
      )}
    </FormItem>
  </Form>
}

class User extends Component {
  static propTypes = {
    user: PropTypes.object
  }

  static defaultProps = {
    user: {}
  }

  state = {
    visible: false,
    confirmLoading: false
  }

  componentDidMount () {
    // 获取登录状态
    const { dispatch } = this.props
    const idCookie = getCookie('__IMUSIC_ID')
    if (idCookie) dispatch(refreshLogin(idCookie))
  }

  // 退出登录, 当前仅能在cookie上操作, 后台未提供接口
  loginOut = () => {
    const { dispatch, location, history } = this.props
    deleteCookie('__IMUSIC_ID')
    dispatch(setLocalUser())
    this.setState({ visible: false })
    if (location.pathname !== '/musicCenter') history.push('/musicCenter')
  }

  // 确认登录
  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log(err)
      } else {
        const { dispatch } = this.props
        const { phone, password } = values
        this.setState({ confirmLoading: true })
        dispatch(phoneLogin(phone, password)).then(res => {
          if (res && res.status === 'resolve') {
            this.setState({
              visible: false,
              confirmLoading: false
            })
            let id = res.profile && res.profile.userId
            setCookie('__IMUSIC_ID', id, 10)
          } else {
            this.setState({ confirmLoading: false })
            message.warning(res.msg || '频繁登录，请稍后重试')
          }
        }).catch(err => {
          console.warn(err)
          this.setState({ confirmLoading: false })
          message.warning('网络错误')
        })
      }
    })
  }

  // Popover的显示隐藏回调
  onPopoverVisibleChange = visible => this.setState({ visible })

  // set visible to true 可控制 Modal || Popover
  show = () => this.setState({ visible: true })

  // set visible to false 可控制 Modal || Popover
  hide = (e) => {
    e.stopPropagation()
    this.setState({
      visible: false
    })
  }

  render () {
    const { visible, confirmLoading } = this.state
    const { user } = this.props
    const profile = user.profile || {}
    return <div className="user-info">
      {(() => {
        if (user.isLocal === false && !confirmLoading) {
          return <Popover
            placement="rightTop"
            content={<Card
              style={{ width: 200 }}
              cover={<img alt="头像" src={profile.avatarUrl} />}
              actions={[<Button type="danger" onClick={this.loginOut}>退出登录</Button>]}>
              <Card.Meta
                title={profile.nickname}
                description={profile.signature} />
            </Card>}
            trigger="click"
            visible={visible}
            onVisibleChange={this.onPopoverVisibleChange}>
            <UserAvatar profile={profile} onClick={this.show} />
          </Popover>
        } else {
          return <div>
            <UserAvatar profile={profile} onClick={this.show} />
            <Modal
              visible={visible}
              title="使用网易云音乐帐号登录"
              wrapClassName="login-modal"
              width={400}
              okText="登录"
              cancelText="取消"
              onOk={this.handleOk}
              confirmLoading={confirmLoading}
              onCancel={this.hide}>
              <LoginForm props={this.props} />
            </Modal>
          </div>
        }
      })()}
    </div>
  }
}

export default Form.create()(withRouter(connect(mapStateToProps)(User)))

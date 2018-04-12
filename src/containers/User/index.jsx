import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Avatar, Modal, Form, Input, Icon } from 'antd'
import './index.less'

const FormItem = Form.Item

const mapStateToProps = (state, ownProps) => ({
  user: state.user
})

function UserAvatar (user) {
  return user && user.id
    ? <Avatar
      size="large"
      src={user.picUrl} />
    : <span>Local</span>
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

  showModal = () => this.setState({ visible: false }) // TODO

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      if (err) return
      else {
        console.log('Received values of form: ', values)
        this.setState({ confirmLoading: true })
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false
          })
        }, 1000)
      }
    })
  }

  handleCancel = (e) => {
    e.stopPropagation()
    this.setState({
      visible: false
    })
  }

  render () {
    const { visible, confirmLoading } = this.state
    const { user } = this.props
    const { getFieldDecorator } = this.props.form
    return <div className="user-info">
      <div className="avatar" onClick={this.showModal}>
        <UserAvatar user={user} />
      </div>
      <Modal
        visible={visible}
        title="登陆"
        okText="确认"
        cancelText="取消"
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}>
        <Form>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password" placeholder="密码" />
            )}
          </FormItem>
        </Form>
      </Modal>
    </div>
  }
}

export default Form.create()(connect(mapStateToProps)(User))

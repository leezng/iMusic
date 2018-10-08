import React, { Component } from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { Form, Input, InputNumber, Switch, Button } from 'antd'
import './index.less'
import { getObjectValue } from 'renderer/utils'
import { setPreferences } from 'renderer/actions'

const FormItem = Form.Item

const mapStateToProps = (state, ownProps) => ({
  preferences: state.preferences
})

class Setting extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  initValue = (id) => {
    const { preferences } = this.props
    return getObjectValue(preferences, id)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log('err', err)
      } else {
        console.log('Received values of form: ', values)
        const { dispatch } = this.props
        dispatch(setPreferences(values))
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 }
    }
    return (
      <Form onSubmit={this.handleSubmit} className="setting-form">
        <FormItem {...formItemLayout} label="使用代理">
          {getFieldDecorator('proxy.use', { initialValue: this.initValue('proxy.use'), valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="代理地址">
          {getFieldDecorator('proxy.url', {
            initialValue: this.initValue('proxy.url'),
            rules: [{
              type: 'url',
              message: '请输入代理地址'
            }]
          })(
            <Input placeholder="请输入代理地址" />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="代理端口">
          {getFieldDecorator('proxy.port', {initialValue: this.initValue('proxy.port')})(
            <InputNumber placeholder="请输入端口号，默认使用80端口" min={0} />
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 14, offset: formItemLayout.labelCol.span }}
        >
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </Form>
    )
  }
}

export default connect(mapStateToProps)(Form.create()(Setting))

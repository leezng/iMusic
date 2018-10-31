import React, { Component } from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { Row, Col, Form, Input, InputNumber, Switch } from 'antd'
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

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 10 }
    }
    return (
      <Form className="setting-form">
        <Row className="setting-title">
          <Col {...formItemLayout.labelCol}>设置</Col>
        </Row>

        <div className="block">
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
                message: '格式不规范'
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
        </div>
      </Form>
    )
  }
}

let timer
const EnhancedForm = Form.create({
  // 任一表单值变化则更新redux
  onValuesChange (props, changedValues, allValues) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      props.dispatch(setPreferences(allValues))
    }, 300)
  }
})(Setting)

export default connect(mapStateToProps)(EnhancedForm)

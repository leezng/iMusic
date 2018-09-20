import React, { Component } from 'react'
import { connect } from 'react-redux'
// import PropTypes from 'prop-types'
import { Form, Input, Switch, Button } from 'antd'
import './index.less'

const FormItem = Form.Item

const mapStateToProps = (state, ownProps) => ({
  searchResult: state.searchResult
})

class Setting extends Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values)
      if (!err) {
        console.log('err', err)
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="Switch">
          {getFieldDecorator('switch', { valuePropName: 'checked' })(
            <Switch />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="Name">
          {getFieldDecorator('username', {
            rules: [{
              required: true,
              message: 'Please input your name'
            }]
          })(
            <Input placeholder="Please input your name" />
          )}
        </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 6 }}
        >
          <Button type="primary" htmlType="submit">Submit</Button>
        </FormItem>
      </Form>
    )
  }
}

export default connect(mapStateToProps)(Form.create()(Setting))

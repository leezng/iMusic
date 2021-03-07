import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, InputNumber, Switch } from 'antd';

let timer: ReturnType<typeof setTimeout>;

const Setting = () => {
  const dispatch = useDispatch();
  const preferences = useSelector((state) => state.preferences);

  const [form] = Form.useForm();

  const onValuesChange = (changedValues, allValues) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      dispatch({
        type: 'setPreferences',
        payload: allValues,
      });
    }, 300);
  };

  const formItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 10 },
  };

  useEffect(() => {
    form.setFieldsValue(preferences);
  }, [preferences]);

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      <div>设置</div>

      <div style={{ padding: '10px 0', borderTop: '1px solid #e8e8e8' }}>
        <Form.Item
          {...formItemLayout}
          label="使用代理"
          name={['proxy', 'status']}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="代理地址"
          name={['proxy', 'url']}
          rules={[{ type: 'url', message: '格式不规范' }]}
        >
          <Input placeholder="请输入代理地址" />
        </Form.Item>

        <Form.Item {...formItemLayout} label="代理端口" name={['proxy', 'port']}>
          <InputNumber min={0} />
        </Form.Item>
      </div>
    </Form>
  );
};

export default Setting;

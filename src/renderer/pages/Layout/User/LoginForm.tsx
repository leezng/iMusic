import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, message } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { UserOutlined } from '@ant-design/icons';
import request from 'renderer/utils/request';

const LoginForm: React.FC<ModalProps> = ({ ...modalProps }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onOk = async () => {
    try {
      setConfirmLoading(true);
      const { phone, password } = await form.validateFields();
      const result = await request({
        url: '/login/cellphone',
        params: {
          phone,
          password,
        },
      });
      const id = result?.profile?.userId;
      if (id) {
        dispatch({
          type: 'setUser',
          payload: {
            id,
            name: result?.profile?.nickname,
            profile: result?.profile,
            isLocal: false,
          },
        });
        modalProps?.onOk();
      } else {
        message.warning(result.msg || '频繁登录，请稍后重试');
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      {...modalProps}
      title="使用网易云音乐帐号登录"
      okText="登录"
      onOk={onOk}
      confirmLoading={confirmLoading}
      afterClose={() => form.resetFields()}
    >
      <Form form={form}>
        <Form.Item
          extra="*目前仅支持使用手机号码登录"
          name="phone"
          rules={[{ required: true, message: '请输入手机号码' }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="手机号码"
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder="密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Avatar, Card, Descriptions, Divider, Tooltip, Popover, Progress } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/hooks';
import request from 'renderer/utils/request';
import LoginForm from './LoginForm';

const UserAvatar = ({ onClick }: any) => {
  const user = useSelector((state) => state.user);

  const commonProps = {
    size: 84,
    onClick,
    style: {
      cursor: 'pointer',
    },
  };
  return user.profile?.avatarUrl ? (
    <Avatar {...commonProps} src={user.profile.avatarUrl} />
  ) : (
    <Avatar {...commonProps}>IMusic</Avatar>
  );
};

const User = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const user = useSelector((state) => state.user);

  const [visible, setVisible] = useState(false);

  const { data: userLevel = {} } = useRequest(
    {
      url: user.isLocal ? '' : '/user/level',
    },
    {
      initialData: {},
      refreshDeps: [user.isLocal],
      formatResult: (result) => result.data || {},
    },
  );

  const { data: userSubcount = {} } = useRequest(
    {
      url: user.isLocal ? '' : '/user/subcount',
    },
    {
      initialData: {},
      refreshDeps: [user.isLocal],
    },
  );

  const logout = async () => {
    await request({
      url: '/logout',
    });
    dispatch({
      type: 'setUser',
      payload: {
        id: '',
        name: 'LOCAL',
        profile: null,
        isLocal: true,
      },
    });
    if (location.pathname !== '/musicCenter') history.push('/musicCenter');
  };

  const show = () => setVisible(true);

  const hide = () => setVisible(false);

  return (
    <div style={{ textAlign: 'center' }}>
      {user.isLocal ? (
        <UserAvatar onClick={show} />
      ) : (
        <Popover
          placement="bottom"
          content={
            <Card
              size="small"
              bordered={false}
              bodyStyle={{ padding: 0 }}
              style={{ width: 240 }}
              actions={[
                <Tooltip title="退出登录">
                  <LogoutOutlined onClick={logout} />
                </Tooltip>,
              ]}
            >
              <Descriptions colon={false}>
                <Descriptions.Item label="歌单">
                  {userSubcount.createdPlaylistCount}
                </Descriptions.Item>
                <Descriptions.Item label="MV">{userSubcount.mvCount}</Descriptions.Item>
                <Descriptions.Item label="电台">
                  {userSubcount.createDjRadioCount}
                </Descriptions.Item>
              </Descriptions>
              <Divider style={{ margin: '0 0 10px 0' }} />
              <Progress
                format={() => `LV ${userLevel.level}`}
                percent={userLevel.progress * 100 || 0}
              />
              <Card.Meta
                avatar={<Avatar src={user.profile?.avatarUrl} />}
                title={user.profile?.nickname}
                description={user.profile?.signature}
                style={{ padding: '20px 0' }}
              />
            </Card>
          }
          trigger="click"
        >
          <UserAvatar />
        </Popover>
      )}
      <LoginForm visible={visible} onOk={hide} onCancel={hide} />
    </div>
  );
};

export default User;

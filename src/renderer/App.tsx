import React, { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { UseAPIProvider } from '@umijs/use-request';
import { getPreferences } from 'renderer/utils/rpc';
import request from 'renderer/utils/request';
import store from './models';
import Layout from './pages/Layout';
import './themes/index.less';

export default () => {
  const init = async () => {
    const { dispatch } = store;
    // 获取偏好设置
    const preferences = await getPreferences();
    dispatch({
      type: 'setPreferences',
      payload: preferences,
    });

    // 获取登录态
    const loginStatus = await request({
      url: '/login/status',
    });
    const profile = loginStatus?.profile;
    if (profile) {
      dispatch({
        type: 'setUser',
        payload: {
          id: profile.userId,
          name: profile.nickname,
          profile,
          isLocal: false,
        },
      });
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Provider store={store}>
      <HashRouter>
        <UseAPIProvider
          value={{
            pollingWhenHidden: false,
            loadingDelay: 100,
            throttleInterval: 1000,
            requestMethod: request,
          }}
        >
          <ConfigProvider locale={zhCN}>
            <Layout />
          </ConfigProvider>
        </UseAPIProvider>
      </HashRouter>
    </Provider>
  );
};

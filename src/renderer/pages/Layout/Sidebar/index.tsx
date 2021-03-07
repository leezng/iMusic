import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router';
import { Menu, Input, Layout } from 'antd';
import { AppstoreOutlined, CustomerServiceOutlined, HeartOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/hooks';
import User from '../User';
import styles from './index.module.less';

const menuData = [
  {
    name: '发现音乐',
    key: 'musicCenter',
    icon: <AppstoreOutlined />,
  },
  {
    name: '播放队列',
    key: 'playlist',
    icon: <CustomerServiceOutlined />,
  },
  {
    //   name: '我的音乐',
    //   key: 'userMusic',
    //   icon: <EditOutlined />,
    //   isLocal: false
    // }, {
    name: '我的歌单',
    key: 'userSongList',
    icon: <HeartOutlined />,
    isLocal: false,
    subMenu: [], // subMenu数据实际来源于store
  },
];

const Sidebar = () => {
  const history = useHistory();
  const location = useLocation();

  const user = useSelector((state) => state.user);

  const [activeMenu, setActiveMenu] = useState('musicCenter');

  const { data: userSongList = [] } = useRequest(
    user.id && {
      url: '/user/playlist',
      params: {
        uid: user.id,
      },
    },
    {
      initialData: [],
      refreshDeps: [user.id],
      formatResult: (data) => data?.playlist || [],
    },
  );

  useEffect(() => {
    const pathName = location.pathname.slice(1);
    if (pathName) setActiveMenu(pathName);
  }, []);

  useEffect(() => {
    const newPath = location.pathname;
    if (menuData.every((item) => newPath.indexOf(item.key) === -1)) {
      // 若新的路由不在侧边栏控制的范围内, 则清除激活标签
      setActiveMenu(null);
    }
  }, [location.pathname]);

  const onSearch = (text) => {
    const keywords = text.trim();
    if (!keywords) return;

    const newPath = '/searchlist';
    // 跳转到搜索结果页
    history.push(`${newPath}?keywords=${keywords}`);
    // 清除侧边栏激活标签
    setActiveMenu(null);
  };

  const onMenuItemClick = ({ key, keyPath }) => {
    // console.log('onMenuItemClick: ', key, keyPath)
    const newPath = `/${keyPath.reverse().join('/')}`;
    if (location.pathname !== newPath) {
      history.push(newPath);
      setActiveMenu(key);
    }
  };

  const getMenuContent = (menu) => {
    return menu.map((item) => {
      // 如果是用户歌单, 则subMenu数据来自store
      const subMenu = item.key === 'userSongList' ? userSongList : item.subMenu;
      return subMenu ? (
        <Menu.SubMenu
          key={item.key || item.id}
          title={
            <span>
              {item.icon}
              {item.name}
            </span>
          }
        >
          {getMenuContent(subMenu)}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item.key || item.id}>
          {item.icon}
          {item.name}
        </Menu.Item>
      );
    });
  };

  const menu = user.isLocal === false ? menuData : menuData.filter((k) => k.isLocal !== false);

  return (
    <Layout.Sider className={styles.sider}>
      <User />
      <div style={{ padding: 15 }}>
        <Input.Search placeholder="搜索" onSearch={onSearch} />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[activeMenu]}
        defaultOpenKeys={['userSongList']}
        onClick={onMenuItemClick}
      >
        {getMenuContent(menu)}
      </Menu>
    </Layout.Sider>
  );
};

export default Sidebar;

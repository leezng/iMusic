import { remote, shell } from 'electron';
import React from 'react';
import { useHistory } from 'react-router';
import { Button, Modal } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  SettingOutlined,
  CopyrightOutlined,
  MinusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import pkgInfo from '@/package.json';
import styles from './index.module.less';

const TitleBar = () => {
  const history = useHistory();

  const win = remote.getCurrentWindow();

  const isWin = process.platform === 'win32';

  const showInfo = () => {
    Modal.info({
      title: `${pkgInfo.name} - ${pkgInfo.version}`,
      content: (
        <div>
          <div>本项目仅用于技术交流，禁止用于商业用途</div>
          <div>
            Copyright © 2018 ~ {new Date().getFullYear()}
            <Button
              type="link"
              onClick={() => shell.openExternal('https://github.com/leezng/iMusic')}
            >
              leezng
            </Button>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className={styles.titleBar}>
      <div className={styles.commonController}>
        <LeftOutlined onClick={() => history.go(-1)} />
        <RightOutlined onClick={() => history.go(1)} />
        <SettingOutlined onClick={() => history.push('/setting')} />
        <CopyrightOutlined onClick={showInfo} />
      </div>
      {isWin && (
        <div className={styles.winController}>
          <Button icon={<MinusOutlined />} size="small" onClick={() => win.minimize()} />
          <Button icon={<CloseOutlined />} size="small" onClick={() => win.close()} />
        </div>
      )}
    </div>
  );
};

export default TitleBar;

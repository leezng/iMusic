import React from 'react';
import { Card, List } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import styles from './index.module.less';

export interface Props {
  loading: boolean;
  dataSource: {
    name: string;
    picUrl: string;
    desc?: string;
  }[];
  onItemClick: (item: unknown) => void;
}

export default ({ loading, dataSource, onItemClick }: Props) => (
  <List
    grid={{ gutter: 20, column: 5 }}
    loading={loading}
    dataSource={dataSource}
    pagination={{
      pageSize: 10,
    }}
    renderItem={(item) => {
      return (
        <List.Item className={styles.listItem} onClick={() => onItemClick(item)}>
          <Card hoverable size="small" cover={<img alt="无法获取图片" src={item.picUrl} />}>
            <Card.Meta
              title={
                <div className={styles.meta}>
                  <span className={styles.name}>{item.name}</span>
                  <PlayCircleOutlined height={24} className={styles.play} />
                </div>
              }
              description={item.desc}
            />
          </Card>
        </List.Item>
      );
    }}
  />
);

/**
 * 本地播放队列
 */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Tag, Popconfirm } from 'antd';
import ActionGroup from 'renderer/components/ActionGroup';

const Playlist = () => {
  const dispatch = useDispatch();

  const player = useSelector((state) => state.player);

  const { playing, playlist } = player;

  const [current, setCurrent] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const onChange = ({ current: pageIndex, pageSize }: any) => {
    setCurrent(pageIndex);
    setPageSize(pageSize);
  };

  useEffect(() => {
    // 根据props与playing决定是否设置当前页码
    const idx = playlist.findIndex((item) => item.id === playing?.id);
    const current = idx !== -1 ? Math.floor((idx + pageSize) / pageSize) : 1;
    // 切换到播放歌曲的页码
    setCurrent(current);
  }, [playing]);

  const columns = [
    {
      title: '歌曲',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        return playing?.id === record.id ? (
          <span>
            {record.name}
            <Tag color="magenta" style={{ marginLeft: 10 }}>
              正在播放
            </Tag>
          </span>
        ) : (
          record.name
        );
      },
    },
    {
      title: '歌手',
      dataIndex: 'artists',
      key: 'artists',
      width: '40%',
      render: (text, record) => record.artists?.[0]?.name,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record) => <ActionGroup actions={['play', 'remove']} song={record} />,
    },
  ];

  const enabled = playlist && playlist.length;

  return (
    <div>
      <div>
        <Button
          size="small"
          disabled={!enabled}
          onClick={() => dispatch({ type: 'upsetPlaylist' })}
          style={{ marginRight: 10 }}
        >
          打乱顺序
        </Button>
        <Popconfirm
          title="你真的要清空整个队列吗?"
          onConfirm={() =>
            dispatch({
              type: 'setPlaylist',
              payload: [],
            })
          }
          okText="确认"
          cancelText="取消"
        >
          <Button size="small" danger disabled={!enabled}>
            清空播放队列
          </Button>
        </Popconfirm>
      </div>

      <Table
        size="small"
        columns={columns}
        dataSource={playlist}
        pagination={{
          current,
          pageSize,
          total: playlist && playlist.length,
        }}
        onChange={onChange}
        locale={{
          emptyText: '暂无歌曲',
        }}
        rowKey="id"
      />
    </div>
  );
};

export default Playlist;

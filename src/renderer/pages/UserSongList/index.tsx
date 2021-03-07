import React from 'react';
import { useParams } from 'react-router';
import { Table } from 'antd';
import { useRequest } from '@umijs/hooks';
import ActionGroup from 'renderer/components/ActionGroup';

const UserSongList = () => {
  const { id } = useParams();

  const playListId = +id;

  const { data = {}, loading } = useRequest(
    {
      url: '/playlist/detail',
      params: {
        id: playListId,
      },
    },
    {
      initialData: [],
      refreshDeps: [playListId],
      formatResult: (result) => result.playlist || {},
    },
  );

  const columns = [
    {
      title: '歌曲',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '歌手',
      dataIndex: 'artists',
      key: 'artists',
      width: '40%',
      render: (text, record) => record.ar?.[0].name,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record) => <ActionGroup actions={['play', 'add']} song={record} />,
    },
  ];

  return (
    <Table
      size="middle"
      loading={loading}
      columns={columns}
      dataSource={data.tracks || []}
      rowKey="id"
    />
  );
};

export default UserSongList;

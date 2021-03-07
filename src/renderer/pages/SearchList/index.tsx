import React, { useState } from 'react';
import { Table } from 'antd';
import { useLocation } from 'react-router';
import { useRequest } from '@umijs/hooks';
import { parse } from 'qs';
import ActionGroup from 'renderer/components/ActionGroup';

const SearchList = () => {
  const location = useLocation();

  const query = parse(location.search.slice(1));

  const [options, setOptions] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const defaultData = {
    list: [],
    total: 0,
  };

  const { data = defaultData, loading } = useRequest(
    {
      url: '/search',
      params: {
        keywords: query.keywords,
        offset: options.pageIndex - 1,
        limit: options.pageSize,
      },
    },
    {
      initialData: defaultData,
      refreshDeps: [options, query.keywords],
      formatResult: (data) => ({
        list: data.result?.songs || [],
        total: data.result?.songCount || 0,
      }),
    },
  );

  const onChange = ({ current: pageIndex, pageSize }: any) => {
    setOptions((prev) => ({
      ...prev,
      pageIndex,
      pageSize,
    }));
  };

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
      render: (text, record) => record.artists[0].name,
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
      className="searchlist"
      size="small"
      loading={loading}
      pagination={{
        pageSize: options.pageSize,
        total: data.total,
      }}
      onChange={onChange}
      columns={columns}
      dataSource={data.list}
      rowKey="id"
    />
  );
};

export default SearchList;

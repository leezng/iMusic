import React from 'react';
import { useHistory } from 'react-router';
import { useRequest } from '@umijs/hooks';
import CardList from 'renderer/components/CardList';

const Comp = () => {
  const history = useHistory();

  const { data = {}, loading } = useRequest(
    {
      url: '/top/artists',
      params: {
        offset: 0,
        limit: 30,
      },
    },
    {
      initialData: {},
    },
  );

  const onItemClick = ({ id }) => {
    history.push(`artistDetail/${id}`);
  };

  const { artists = [] } = data;

  return <CardList loading={loading} dataSource={artists} onItemClick={onItemClick} />;
};

export default Comp;

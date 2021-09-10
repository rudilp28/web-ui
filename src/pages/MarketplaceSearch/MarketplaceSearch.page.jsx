import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import MarketplaceSearchHeader from './MarketplaceSearchHeader';
import MarketplaceSearchFilters from './MarketplaceSearchFilters';
import MarketplaceSearchResults from './MarketplaceSearchResults';

import './MarketplaceSearch.style.less';

const MarketplaceSearch = () => {
  const history = useHistory();

  const tasks = [
    {
      uuid: '1',
      name: 'Upload de arquivo',
      type: 'Tarefa',
      category: 'DATASETS',
      description: 'Faça o upload de arquivo para usar como dataset.',
      author: {
        uuid: '1',
        name: 'Nome do Autor',
        img: '',
        userName: '@author',
      },
    },
    {
      uuid: '2',
      name: 'Upload de arquivo',
      type: 'Tarefa',
      category: 'DATASETS',
      description: 'Faça o upload de arquivo para usar como dataset.',
      author: {
        uuid: '1',
        name: 'Nome do Autor',
        img: '',
        userName: '@author',
      },
    },
    {
      uuid: '3',
      name: 'Upload de arquivo',
      type: 'Tarefa',
      category: 'DATASETS',
      description: 'Faça o upload de arquivo para usar como dataset.',
      author: {
        uuid: '1',
        name: 'Nome do Autor',
        img: '',
        userName: '@author',
      },
    },
    {
      uuid: '4',
      name: 'Upload de arquivo',
      type: 'Tarefa',
      category: 'DATASETS',
      description: 'Faça o upload de arquivo para usar como dataset.',
      author: {
        uuid: '1',
        name: 'Nome do Autor',
        img: '',
        userName: '@author',
      },
    },
  ];

  const [filters, setFilters] = useState(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const paramsObject = {};
    searchParams.forEach((value, key) => {
      paramsObject[key] = value === 'true'; // value is a string
    });
    return paramsObject;
  });

  const [listType, setListType] = useState('grid');
  const [listOrder, setListOrder] = useState('new');

  const handleGoBack = () => {
    history.goBack();
  };

  const handleChangeFilters = (categoryKey, isChecked) => {
    setFilters((currentFilters) => {
      const filtersClone = { ...currentFilters };
      if (isChecked) filtersClone[categoryKey] = isChecked;
      else delete filtersClone[categoryKey];

      history.push({
        pathname: history.location.pathname,
        search: `?${new URLSearchParams(filtersClone)}`,
      });

      return filtersClone;
    });
  };

  const handleClearFilters = () => {
    setFilters({});
    history.push({
      pathname: history.location.pathname,
      search: '',
    });
  };

  const handleChangeListType = () => {
    setListType((currentListType) =>
      currentListType === 'grid' ? 'list' : 'grid'
    );
  };

  return (
    <div className='marketplace-search'>
      <MarketplaceSearchHeader handleGoBack={handleGoBack} />

      <div className='marketplace-search-content'>
        <MarketplaceSearchFilters
          filters={filters}
          handleClearFilters={handleClearFilters}
          handleChangeFilters={handleChangeFilters}
        />

        <MarketplaceSearchResults
          tasks={tasks}
          listType={listType}
          listOrder={listOrder}
          handleChangeListOrder={setListOrder}
          handleChangeListType={handleChangeListType}
        />
      </div>
    </div>
  );
};

export default MarketplaceSearch;

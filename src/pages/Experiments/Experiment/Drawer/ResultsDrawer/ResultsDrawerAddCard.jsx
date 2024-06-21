import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const ResultsDrawerAddCard = ({ isAdding, handleAddResult }) => {
  return (
    <Card className='results-drawer-add-card'>
      <Button
        shape='round'
        type='primary-inverse'
        onClick={handleAddResult}
        icon={isAdding ? <LoadingOutlined /> : <PlusOutlined />}
      >
        <span>Adicionar Resultado</span>
      </Button>
    </Card>
  );
};

ResultsDrawerAddCard.propTypes = {
  isAdding: PropTypes.bool,
  handleAddResult: PropTypes.func,
};

ResultsDrawerAddCard.defaultProps = {
  isAdding: false,
  handleAddResult: undefined,
};

export default ResultsDrawerAddCard;

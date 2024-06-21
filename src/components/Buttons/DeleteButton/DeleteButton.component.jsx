import React from 'react';

import { Button, Popconfirm } from 'antd';

import PropTypes from 'prop-types';

const DeleteButton = ({ popconfirmText, handleDelete }) => {
  return (
    <Popconfirm
      okText='Sim'
      cancelText='Não'
      title={popconfirmText}
      onConfirm={handleDelete}
    >
      <Button type='link'>Excluir</Button>
    </Popconfirm>
  );
};

DeleteButton.propTypes = {
  popconfirmText: PropTypes.string.isRequired,
  handleDelete: PropTypes.func,
};

export default DeleteButton;

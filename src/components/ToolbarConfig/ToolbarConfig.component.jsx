import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popconfirm } from 'antd';
import { useZoomPanHelper } from 'react-flow-renderer';
import {
  DeleteOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
} from '@ant-design/icons';

const ToolbarConfig = ({ handleDeleteClick, operator, deployment }) => {
  const { fitView, zoomTo, zoomIn, zoomOut } = useZoomPanHelper();

  const handleFitView = () => {
    fitView();
    zoomTo(1);
  };

  return (
    <>
      <Button icon={<ZoomInOutlined />} type='text' onClick={zoomIn} />
      <Button icon={<ZoomOutOutlined />} type='text' onClick={zoomOut} />
      <Button icon={<ExpandOutlined />} type='text' onClick={handleFitView} />

      {!deployment && (
        <Popconfirm
          title='Você tem certeza que deseja excluir esta tarefa?'
          onConfirm={handleDeleteClick}
          okText='Sim'
          cancelText='Não'
          disabled={!operator?.uuid}
        >
          <Button
            icon={<DeleteOutlined />}
            type='text'
            disabled={!operator?.uuid}
          />
        </Popconfirm>
      )}
    </>
  );
};

ToolbarConfig.propTypes = {
  handleDeleteClick: PropTypes.func,
  operator: PropTypes.object,
  deployment: PropTypes.bool,
};

ToolbarConfig.defaultProps = {
  handleDeleteClick: undefined,
  operator: undefined,
  deployment: false,
};

export default ToolbarConfig;

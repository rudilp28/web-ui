import React from 'react';
import { Popover } from 'antd';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';

import { TASK_CATEGORIES } from 'configs';

import './TaskDataPopover.style.less';

const TaskDataPopover = ({ title, taskData }) => {
  if (!taskData) return null;

  const getFormattedDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  const taskCategoryName = taskData.category
    ? TASK_CATEGORIES[taskData.category]?.name
    : '';

  return (
    <Popover
      title={<div className='task-data-popover-title'>{title}</div>}
      overlayStyle={{ maxWidth: '400px' }}
      placement='bottomRight'
      trigger='hover'
      content={
        <div className='task-data-popover-content'>
          <div className='task-data-popover-content-item'>
            <strong>Nome Original:</strong>
            <span>{taskData.name}</span>
          </div>

          {taskData.createdAt && (
            <div className='task-data-popover-content-item'>
              <strong>Data de Criação:</strong>
              <span>{getFormattedDate(taskData.createdAt)}</span>
            </div>
          )}

          {taskData.updatedAt && (
            <div className='task-data-popover-content-item'>
              <strong>Última Alteração:</strong>
              <span>{getFormattedDate(taskData.updatedAt)}</span>
            </div>
          )}

          {taskData.description && (
            <div className='task-data-popover-content-item-large'>
              <div>
                <strong>Descrição</strong>
              </div>
              <span>{taskData.description}</span>
            </div>
          )}

          {(taskData.dataIn || taskData.dataOut) && (
            <div className='task-data-popover-content-item-large'>
              {taskData.dataIn && (
                <div className='task-data-popover-content-item'>
                  <strong>Dados de Entrada:</strong>
                  <span>{taskData.dataIn}</span>
                </div>
              )}

              {taskData.dataOut && (
                <div className='task-data-popover-content-item'>
                  <strong>Dados de Saída:</strong>
                  <span>{taskData.dataOut}</span>
                </div>
              )}
            </div>
          )}

          {taskCategoryName && (
            <div className='task-data-popover-content-item'>
              <strong>Categoria:</strong>
              <span>{taskCategoryName}</span>
            </div>
          )}

          {taskData.tags?.length && (
            <div className='task-data-popover-content-item'>
              <strong>Tags de Busca:</strong>
              <span>{taskData.tags.join(', ')}</span>
            </div>
          )}

          {taskData.docs && (
            <div className='task-data-popover-content-item'>
              <strong>Documentação:</strong>
              <span>{taskData.docs}</span>
            </div>
          )}
        </div>
      }
    >
      <InfoCircleOutlined />
    </Popover>
  );
};

TaskDataPopover.propTypes = {
  title: PropTypes.string.isRequired,
  taskData: PropTypes.object.isRequired,
};

export default TaskDataPopover;

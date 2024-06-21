import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ResizePanel from 'react-resize-panel';
import { Tooltip, Input, Button } from 'antd';
import {
  EditOutlined,
  CloseOutlined,
  CheckOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { TaskDataPopover } from 'components';

import './ResizableSection.less';

const ResizableSection = ({
  title,
  children,
  placeholder,
  isEditingTitle,
  isSavingNewTitle,
  isShowingEditIcon,
  operatorOriginalTask,
  handleStartEditing,
  handleCancelEditing,
  handleSaveModifiedTitle,
}) => {
  const newTitleRef = useRef(null);

  const getValues = () => {
    const newTitle = (newTitleRef.current?.state?.value || '').trim();
    return { newTitle };
  };

  const handleValidation = () => {
    const { newTitle } = getValues();
    if (newTitle) return true;
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { newTitle } = getValues();
      if (newTitle === title) handleCancelEditing();
      else handleSaveModifiedTitle(newTitle);
    }
  };

  const renderResizableSectionHeader = () => {
    if (!title) return null;

    const taskDataPopover = operatorOriginalTask ? (
      <div className='resizable-section-tip'>
        <TaskDataPopover title={title} taskData={operatorOriginalTask} />
      </div>
    ) : null;

    if (isEditingTitle) {
      return (
        <div className='resizable-section-header'>
          <form
            className='resizable-section-header-form'
            onSubmit={isSavingNewTitle ? undefined : handleSubmit}
            noValidate
          >
            <Input
              ref={newTitleRef}
              type='text'
              size='middle'
              defaultValue={title}
              disabled={isSavingNewTitle}
              placeholder='Escreva um novo nome'
            />

            <Tooltip title='Cancelar Edição' placement='bottom'>
              <Button
                type='default'
                shape='circle'
                icon={<CloseOutlined />}
                disabled={isSavingNewTitle}
                onClick={handleCancelEditing}
              />
            </Tooltip>

            <Tooltip title='Salvar' placement='bottom'>
              <Button
                type='default'
                shape='circle'
                htmlType='submit'
                disabled={isSavingNewTitle}
                icon={
                  isSavingNewTitle ? <LoadingOutlined /> : <CheckOutlined />
                }
              />
            </Tooltip>
          </form>

          {taskDataPopover}
        </div>
      );
    }

    return (
      <div className='resizable-section-header'>
        <div className='resizable-section-header-grow'>
          {title && (
            <Tooltip placement='top' title={title}>
              <div className='resizable-section-title'>{title}</div>
            </Tooltip>
          )}

          {isShowingEditIcon && (
            <Tooltip title='Editar' placement='bottom'>
              <EditOutlined
                className='resizable-section-edit-icon'
                onClick={handleStartEditing}
                type='edit'
              />
            </Tooltip>
          )}
        </div>

        {taskDataPopover}
      </div>
    );
  };

  useEffect(() => {
    if (isEditingTitle) {
      setTimeout(() => {
        if (newTitleRef.current) newTitleRef.current.focus();
      }, 0);
    }
  }, [isEditingTitle]);

  return (
    <ResizePanel
      direction='w'
      style={{ width: '18%' }}
      handleClass='customHandle'
      borderClass='customResizeBorder'
    >
      <div className='resizable-section'>
        {renderResizableSectionHeader()}

        {children ? (
          <div className='resizable-section-body'>{children}</div>
        ) : (
          placeholder
        )}
      </div>
    </ResizePanel>
  );
};

ResizableSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  placeholder: PropTypes.node,
  isEditingTitle: PropTypes.bool,
  isSavingNewTitle: PropTypes.bool,
  isShowingEditIcon: PropTypes.bool,
  operatorOriginalTask: PropTypes.string,
  handleStartEditing: PropTypes.func,
  handleCancelEditing: PropTypes.func,
  handleSaveModifiedTitle: PropTypes.func,
};

ResizableSection.defaultProps = {
  title: undefined,
  children: undefined,
  placeholder: undefined,
  isEditingTitle: false,
  isSavingNewTitle: false,
  isShowingEditIcon: true,
  operatorOriginalTask: undefined,
  handleStartEditing: undefined,
  handleCancelEditing: undefined,
  handleSaveModifiedTitle: undefined,
};

export default ResizableSection;

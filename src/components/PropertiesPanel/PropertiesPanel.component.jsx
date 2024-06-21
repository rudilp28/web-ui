import React from 'react';
import PropTypes from 'prop-types';

import { ResizableSection } from 'components';

import './PropertiesPanel.component.less';

const PropertiesPanel = ({
  title,
  children,
  isEditingTitle,
  isSavingNewTitle,
  isShowingEditIcon,
  operatorOriginalTask,
  handleStartEditing,
  handleCancelEditing,
  handleSaveModifiedTitle,
}) => {
  return (
    <ResizableSection
      title={title || 'Propriedades'}
      isEditingTitle={isEditingTitle}
      isSavingNewTitle={isSavingNewTitle}
      isShowingEditIcon={isShowingEditIcon}
      operatorOriginalTask={operatorOriginalTask}
      handleStartEditing={handleStartEditing}
      handleCancelEditing={handleCancelEditing}
      handleSaveModifiedTitle={handleSaveModifiedTitle}
      placeholder={
        <p className='propertiesPanelEmptySectionPlaceholder'>
          Selecione uma tarefa para visualizar ou editar os parâmetros.
        </p>
      }
    >
      {children}
    </ResizableSection>
  );
};

PropertiesPanel.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  isEditingTitle: PropTypes.bool,
  isSavingNewTitle: PropTypes.bool,
  isShowingEditIcon: PropTypes.bool,
  operatorOriginalTask: PropTypes.object,
  handleStartEditing: PropTypes.func,
  handleCancelEditing: PropTypes.func,
  handleSaveModifiedTitle: PropTypes.func,
};

PropertiesPanel.defaultProps = {
  title: undefined,
  children: undefined,
  isEditingTitle: false,
  isSavingNewTitle: false,
  isShowingEditIcon: true,
  operatorOriginalTask: undefined,
  handleStartEditing: undefined,
  handleCancelEditing: undefined,
  handleSaveModifiedTitle: undefined,
};

export default PropertiesPanel;

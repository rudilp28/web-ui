import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { fetchTasks, getTasks } from 'store/tasks';
import { getDeploymentsUrl } from 'store/deployments';
import { ExternalDatasetHelperModal } from 'components/Modals';
import { PropertiesPanel, ExternalDatasetDrawer } from 'components';
import { OPERATOR_TYPES, renameDeploymentOperator } from 'store/operator';
import { useBooleanState, useDeepEqualSelector, useIsLoading } from 'hooks';

const operatorSelector = ({ operatorReducer }) => {
  return operatorReducer;
};

const isDatasetOperatorSelector = ({ operatorReducer }) => {
  return operatorReducer?.tags?.includes('DATASETS');
};

const PropertiesResizableContainer = () => {
  const { projectId, deploymentId } = useParams();
  const dispatch = useDispatch();

  const [
    isShowingExternalDatasetHelperModal,
    handleShowExternalDatasetHelperModal,
    handleHideExternalDatasetHelperModal,
  ] = useBooleanState(false);

  const [
    isEditingOperatorName,
    handleStartEditingOperatorName,
    handleCancelEditingOperatorName,
  ] = useBooleanState(false);

  const tasks = useDeepEqualSelector(getTasks);
  const operator = useDeepEqualSelector(operatorSelector);
  const isDatasetOperator = useDeepEqualSelector(isDatasetOperatorSelector);
  const deploymentUrl = useDeepEqualSelector(getDeploymentsUrl(deploymentId));

  const isRenamingOperator = useIsLoading(
    OPERATOR_TYPES.RENAME_DEPLOYMENT_OPERATOR_REQUEST
  );

  const operatorOriginalTask = useMemo(() => {
    if (!operator || !tasks?.length) return null;
    return tasks.find(({ uuid }) => uuid === operator.taskId);
  }, [operator, tasks]);

  const handleSaveNewOperatorName = (newName) => {
    const operatorId = operator?.uuid;
    dispatch(
      renameDeploymentOperator({
        projectId,
        deploymentId,
        operatorId,
        newName,
        successCallback: handleCancelEditingOperatorName,
      })
    );
  };

  // Cancel the edition of the operator name when change the selected operator
  useEffect(() => {
    handleCancelEditingOperatorName();
  }, [handleCancelEditingOperatorName, operator.uuid]);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <PropertiesPanel
      title={operator?.name}
      isShowingEditIcon={!!operator?.name}
      isSavingNewTitle={isRenamingOperator}
      isEditingTitle={isEditingOperatorName}
      operatorOriginalTask={operatorOriginalTask}
      handleSaveModifiedTitle={handleSaveNewOperatorName}
      handleStartEditing={handleStartEditingOperatorName}
      handleCancelEditing={handleCancelEditingOperatorName}
    >
      {isDatasetOperator && (
        <ExternalDatasetDrawer
          propertyTitle='Tipo da fonte de dados'
          propertyTip='Voce pode testar o fluxo usando um arquivo do seu computador ou uma aplicação externa.'
          urlText={deploymentUrl}
          onClickLearnMore={handleShowExternalDatasetHelperModal}
          description="Você pode testar o fluxo com um cliente HTTP, por exemplo o <a target='_blank' rel='noreferrer' href='https://www.postman.com' >Postman.</a>"
        />
      )}

      <ExternalDatasetHelperModal
        onClose={handleHideExternalDatasetHelperModal}
        visible={isShowingExternalDatasetHelperModal}
        url={deploymentUrl}
      />
    </PropertiesPanel>
  );
};

export default PropertiesResizableContainer;

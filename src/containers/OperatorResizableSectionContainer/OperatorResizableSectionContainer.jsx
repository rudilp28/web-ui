import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import {
  OPERATOR_TYPES,
  getOperatorFigures,
  getOperatorResultDataset,
  renameExperimentOperator,
} from 'store/operator';
import { getTasks } from 'store/tasks';
import { OPERATOR_STATUS } from 'configs';
import { useBooleanState, useIsLoading } from 'hooks';
import { ResultsButtonBar } from 'components/Buttons';
import { showOperatorResults } from 'store/ui/actions';
import { PropertiesPanel, PropertyBlock } from 'components';
import { updateExperimentOperatorStoreData } from 'store/projects/experiments/experiments.actions';
import DatasetDrawerContainer from 'pages/Experiments/Experiment/Drawer/DatasetDrawer/DatasetDrawerContainer';
import GenericDrawerContainer from 'pages/Experiments/Experiment/Drawer/GenericDrawer/GenericDrawerContainer';
import NotebookOutputsContainer from 'pages/Experiments/Experiment/Drawer/NotebookOutputs/NotebookOutputsContainer';

import './OperatorResizableSectionContainer.less';

const isDatasetOperatorSelector = ({ operatorReducer }) => {
  return operatorReducer.tags
    ? operatorReducer.tags.includes('DATASETS')
    : false;
};

const operatorSelector = ({ operatorReducer, operatorsReducer }) => {
  const currentOperatorId = operatorReducer.uuid;

  // These lines below are important to get the latest operator status
  // to enable or disable the buttons of this component.
  // The operatorsReducer is an array related to the operators long polling
  const operatorFound = operatorsReducer.find(
    ({ uuid }) => uuid === currentOperatorId
  );

  return operatorFound || operatorReducer;
};

const OperatorResizableSectionContainer = () => {
  const { projectId, experimentId } = useParams();
  const dispatch = useDispatch();

  const [
    isEditingOperatorName,
    handleStartEditingOperatorName,
    handleCancelEditingOperatorName,
  ] = useBooleanState(false);

  const isDatasetOperator = useSelector(isDatasetOperatorSelector);
  const operator = useSelector(operatorSelector);
  const tasks = useSelector(getTasks);

  const isRenamingOperator = useIsLoading(
    OPERATOR_TYPES.RENAME_EXPERIMENT_OPERATOR_REQUEST
  );

  const operatorOriginalTask = useMemo(() => {
    if (!operator || !tasks?.length) return null;
    return tasks.find(({ uuid }) => uuid === operator.taskId);
  }, [operator, tasks]);

  const isResultsButtonBarDisabled = useMemo(() => {
    const isOperatorPending = operator.status === OPERATOR_STATUS.PENDING;
    const isOperatorRunning = operator.status === OPERATOR_STATUS.RUNNING;
    const isOperatorUnset = operator.status === OPERATOR_STATUS.UNSET;
    const hasNoOperatorStatus = !operator.status;

    return (
      !experimentId ||
      hasNoOperatorStatus ||
      isOperatorUnset ||
      isOperatorPending ||
      isOperatorRunning
    );
  }, [experimentId, operator.status]);

  const isNotebookOutputsContainerDisabled = useMemo(() => {
    const isOperatorPending = operator.status === OPERATOR_STATUS.PENDING;
    const isOperatorRunning = operator.status === OPERATOR_STATUS.RUNNING;
    return !experimentId || isOperatorPending || isOperatorRunning;
  }, [operator.status, experimentId]);

  const handleSaveNewOperatorName = (newName) => {
    const operatorId = operator?.uuid;

    const successCallback = () => {
      handleCancelEditingOperatorName();
      dispatch(
        updateExperimentOperatorStoreData({
          projectId,
          experimentId,
          operatorId,
          newOperatorData: { name: newName },
        })
      );
    };

    dispatch(
      renameExperimentOperator({
        projectId,
        experimentId,
        operatorId,
        newName,
        successCallback,
      })
    );
  };

  const handleShowResults = () => {
    dispatch(
      getOperatorFigures(projectId, experimentId, 'latest', operator.uuid)
    );

    dispatch(
      getOperatorResultDataset(projectId, experimentId, operator.uuid, 1, 10)
    );

    dispatch(showOperatorResults());
  };

  // Cancel the edition of the operator name when change the selected operator
  useEffect(() => {
    handleCancelEditingOperatorName();
  }, [handleCancelEditingOperatorName, operator.uuid]);

  return (
    <PropertiesPanel
      title={operator.name}
      isShowingEditIcon={!!operator?.name}
      isSavingNewTitle={isRenamingOperator}
      isEditingTitle={isEditingOperatorName}
      operatorOriginalTask={operatorOriginalTask}
      handleSaveModifiedTitle={handleSaveNewOperatorName}
      handleStartEditing={handleStartEditingOperatorName}
      handleCancelEditing={handleCancelEditingOperatorName}
    >
      {!!operator?.name && (
        <>
          {isDatasetOperator && <DatasetDrawerContainer />}

          <div className='operator-resizable-section-drawer'>
            {!isDatasetOperator && <GenericDrawerContainer />}
          </div>

          {!isDatasetOperator && (
            <PropertyBlock>
              <ResultsButtonBar
                showingResults={false}
                disabled={isResultsButtonBarDisabled}
                handleResultsClick={handleShowResults}
              />

              <NotebookOutputsContainer
                disabled={isNotebookOutputsContainerDisabled}
              />
            </PropertyBlock>
          )}
        </>
      )}
    </PropertiesPanel>
  );
};

export default OperatorResizableSectionContainer;

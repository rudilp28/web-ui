import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useStoreState } from 'react-flow-renderer';

import {
  OPERATOR_TYPES,
  deselectOperator,
  saveOperatorPosition,
  removeOperatorRequest,
  saveOperatorDependencies,
  selectOperatorAndGetData,
} from 'store/operator';
import { getTasks } from 'store/tasks';
import { OPERATORS_TYPES } from 'store/operators';
import { useDeepEqualSelector, useIsLoading } from 'hooks';
import { hideLogsPanel, showLogsPanel } from 'store/ui/actions';
import { fetchExperimentRunStatusRequest } from 'store/projects/experiments/experimentRuns/actions';

import ExperimentFlow from './index';

const operatorsSelector = ({ operatorsReducer }) => {
  return operatorsReducer;
};

const arrowConfigsSelector = ({ uiReducer }) => {
  return uiReducer.operatorsDependencies;
};

const isShowingLogsPanelSelector = ({ uiReducer }) => {
  return uiReducer.logsPanel.isShowing;
};

const numberOfLogsSelector = ({ experimentLogsReducer }) => {
  return experimentLogsReducer.logs.length;
};

const operatorSelector = ({ operatorReducer }) => {
  return operatorReducer;
};

const ExperimentFlowContainer = () => {
  const dispatch = useDispatch();
  const { projectId, experimentId } = useParams();

  const tasks = useDeepEqualSelector(getTasks);
  const operator = useDeepEqualSelector(operatorSelector);
  const operators = useDeepEqualSelector(operatorsSelector);
  const arrowConfigs = useDeepEqualSelector(arrowConfigsSelector);
  const numberOfLogs = useDeepEqualSelector(numberOfLogsSelector);
  const isShowingLogsPanel = useDeepEqualSelector(isShowingLogsPanelSelector);

  const transformations = useStoreState((flowStore) => flowStore.transform);

  const flowLoading = useIsLoading(OPERATORS_TYPES.FETCH_OPERATORS_REQUEST);
  const operatorLoading = useIsLoading(OPERATOR_TYPES.CREATE_OPERATOR_REQUEST);

  const selectOperatorHandler = (selectedOperator) => {
    dispatch(
      selectOperatorAndGetData(projectId, experimentId, selectedOperator)
    );
  };

  const handleSavePosition = (operatorId, position) => {
    dispatch(
      saveOperatorPosition(projectId, experimentId, operatorId, position)
    );
  };

  const handleRemoveOperator = () => {
    dispatch(removeOperatorRequest(projectId, experimentId, operator));
  };

  const handleSaveDependencies = (operatorId, dependencies) => {
    dispatch(
      saveOperatorDependencies(
        projectId,
        experimentId,
        operatorId,
        dependencies,
        operators
      )
    );
  };

  const handleDeselectOperator = () => {
    dispatch(deselectOperator());
  };

  const handleToggleLogsPanel = () => {
    if (isShowingLogsPanel) dispatch(hideLogsPanel());
    else dispatch(showLogsPanel());
  };

  useEffect(() => {
    dispatch(fetchExperimentRunStatusRequest(projectId, experimentId));

    const polling = setInterval(() => {
      dispatch(fetchExperimentRunStatusRequest(projectId, experimentId));
    }, 5000);

    return () => clearInterval(polling);
  }, [dispatch, experimentId, projectId]);

  return (
    <ExperimentFlow
      tasks={tasks}
      operators={operators}
      flowLoading={flowLoading}
      numberOfLogs={numberOfLogs}
      arrowConfigs={arrowConfigs}
      operatorLoading={operatorLoading}
      transformations={transformations}
      isLogsPanelSelected={isShowingLogsPanel}
      handleSavePosition={handleSavePosition}
      handleTaskBoxClick={selectOperatorHandler}
      handleToggleLogsPanel={handleToggleLogsPanel}
      handleSaveDependencies={handleSaveDependencies}
      handleDeselectOperator={handleDeselectOperator}
      handleRemoveOperator={handleRemoveOperator}
    />
  );
};

export default ExperimentFlowContainer;

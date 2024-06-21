import React from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import { useIsLoading } from 'hooks';
import { getTasks } from 'store/tasks';
import { OPERATORS_TYPES } from 'store/operators';
import { DEPLOYMENTS_TYPES } from 'store/deployments';
import DeploymentFlow from 'components/DeploymentFlow';
import { hideLogsPanel, showLogsPanel } from 'store/ui/actions';
import {
  selectOperator,
  deselectOperator,
  saveDeploymentOperatorPosition,
} from 'store/operator';

const operatorsSelector = ({ operatorsReducer }) => {
  return operatorsReducer;
};

const selectedOperatorIdSelector = ({ operatorReducer }) => {
  return operatorReducer.uuid;
};

const isShowingLogsPanelSelector = ({ uiReducer }) => {
  return uiReducer.logsPanel.isShowing;
};

const numberOfLogsSelector = ({ deploymentLogsReducer }) => {
  return deploymentLogsReducer.logs.length;
};

const DeploymentFlowContainer = () => {
  const { projectId, deploymentId } = useParams();
  const dispatch = useDispatch();

  const tasks = useSelector(getTasks);
  const operators = useSelector(operatorsSelector);
  const numberOfLogs = useSelector(numberOfLogsSelector);
  const selectedOperatorId = useSelector(selectedOperatorIdSelector);
  const isShowingLogsPanel = useSelector(isShowingLogsPanelSelector);

  const loading = useIsLoading(
    OPERATORS_TYPES.FETCH_OPERATORS_REQUEST,
    DEPLOYMENTS_TYPES.DELETE_DEPLOYMENT_REQUEST
  );

  const handleSelectOperator = (operator) => {
    dispatch(selectOperator(operator));
  };

  const handleDeselectOperator = () => {
    dispatch(deselectOperator());
  };

  const handleSavePosition = (operatorId, position) => {
    dispatch(
      saveDeploymentOperatorPosition(
        projectId,
        deploymentId,
        operatorId,
        position
      )
    );
  };

  const handleToggleLogsPanel = () => {
    if (isShowingLogsPanel) dispatch(hideLogsPanel());
    else dispatch(showLogsPanel());
  };

  return (
    <DeploymentFlow
      tasks={tasks}
      loading={loading}
      operators={operators}
      numberOfLogs={numberOfLogs}
      selectedOperatorId={selectedOperatorId}
      isLogsPanelSelected={isShowingLogsPanel}
      handleSavePosition={handleSavePosition}
      handleSelectOperator={handleSelectOperator}
      handleToggleLogsPanel={handleToggleLogsPanel}
      handleDeselectOperator={handleDeselectOperator}
    />
  );
};

export default DeploymentFlowContainer;

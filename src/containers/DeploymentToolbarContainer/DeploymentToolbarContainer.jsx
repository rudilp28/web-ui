import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import {
  DEPLOYMENTS_RUNS_TYPES,
  createDeploymentRunRequest,
} from 'store/deployments/deploymentRuns';
import {
  clearAllDeploymentOperators,
  fetchDeploymentOperatorsRequest,
} from 'store/operators';
import { useIsLoading } from 'hooks';
import { PROJECTS_TYPES } from 'store/projects';
import { TestDeploymentContainer } from 'containers';
import ToolbarConfig from 'components/ToolbarConfig';
import { RunDeploymentButton } from 'components/Buttons';
import { PromoteDeploymentModal } from 'components/Modals';
import SaveTemplateContainer from 'containers/SaveTemplateContainer';

import './DeploymentToolbarContainer.less';

const operatorsSelector = ({ operatorsReducer }) => {
  return operatorsReducer;
};

const DeploymentToolbarContainer = () => {
  const { projectId, deploymentId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const [isShowingPromoteModal, setIsShowingPromoteModal] = useState(false);

  const operators = useSelector(operatorsSelector);
  const isLoading = useIsLoading(PROJECTS_TYPES.FETCH_PROJECT_REQUEST);
  const confirmButtonIsLoading = useIsLoading(
    DEPLOYMENTS_RUNS_TYPES.CREATE_DEPLOYMENT_RUN_REQUEST
  );

  const isEmpty = useMemo(() => {
    return operators.length <= 0;
  }, [operators]);

  const handleFetchOperators = useCallback(() => {
    dispatch(fetchDeploymentOperatorsRequest(projectId, deploymentId));
  }, [projectId, deploymentId, dispatch]);

  const handleClearOperators = useCallback(() => {
    dispatch(clearAllDeploymentOperators());
  }, [dispatch]);

  const handleRunDeployment = () => {
    dispatch(createDeploymentRunRequest(projectId, deploymentId, history));
  };

  const runDeploymentHandler = (inputValue) => {
    //TODO: Estou mostrando o valor do input no modal para quando for usar
    console.log(inputValue);
    handleRunDeployment();
  };

  const handleHidePromoteModal = () => {
    setIsShowingPromoteModal(false);
  };

  const handleShowPromoteModal = () => {
    setIsShowingPromoteModal(true);
  };

  useEffect(() => {
    if (deploymentId) {
      handleFetchOperators(projectId, deploymentId);
    } else {
      handleClearOperators();
    }
  }, [projectId, deploymentId, handleFetchOperators, handleClearOperators]);

  return (
    <div className='deployment-toolbar-container'>
      <PromoteDeploymentModal
        isInputDisabled={true}
        visible={isShowingPromoteModal}
        initialInputValue={deploymentId}
        onConfirm={runDeploymentHandler}
        onClose={handleHidePromoteModal}
        urlSuffix='/api/v1.0/predictions'
        confirmButtonIsLoading={confirmButtonIsLoading}
        urlPrefix={`${window.location.origin.toString()}/seldon/anonymous/`}
      />

      <div className='deployment-toolbar-container-controls'>
        <ToolbarConfig deployment />
      </div>

      <div className='deployment-toolbar-container-buttons'>
        <TestDeploymentContainer />

        <Divider
          className='deployment-toolbar-container-divider'
          type='vertical'
        />

        <SaveTemplateContainer disabled={isLoading || isEmpty} />

        <RunDeploymentButton
          onClick={handleShowPromoteModal}
          disabled={isLoading || isEmpty}
        />
      </div>
    </div>
  );
};

export default DeploymentToolbarContainer;

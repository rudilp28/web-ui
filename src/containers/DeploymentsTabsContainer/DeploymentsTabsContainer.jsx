import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import TabsBar from 'components/TabsBar';
import { showNewDeploymentModal } from 'store/ui/actions';
import NewDeploymentModalContainer from 'containers/NewDeploymentModalContainer';
import {
  fetchDeploymentsRequest,
  duplicateDeploymentRequest,
  renameDeploymentRequest,
  deleteDeploymentRequest,
  updateDeploymentPositionRequest,
} from 'store/deployments/actions';

const loadingSelector = ({ uiReducer }) => {
  return uiReducer.deploymentsTabs.loading;
};

const deploymentsSelector = ({ deploymentsReducer }) => {
  return deploymentsReducer;
};

const getCurrentRoutePath = (projectId, deploymentId) => {
  return `/projetos/${projectId}/pre-implantacao/${deploymentId}`;
};

const DeploymentsTabsContainer = () => {
  const { projectId, deploymentId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const isLoading = useSelector(loadingSelector);
  const deployments = useSelector(deploymentsSelector);

  const handleDelete = (deploymentIdToDelete) => {
    dispatch(deleteDeploymentRequest(projectId, deploymentIdToDelete));
  };

  const handleDuplicate = (deploymentIdToDuplicate, newName) => {
    dispatch(
      duplicateDeploymentRequest(projectId, deploymentIdToDuplicate, newName)
    );
  };

  const handleMoveTab = (draggedDeploymentId, hoveredDeploymentId) => {
    const draggedDeployment = deployments.find(
      ({ uuid }) => uuid === draggedDeploymentId
    );

    const hoveredDeployment = deployments.find(
      ({ uuid }) => uuid === hoveredDeploymentId
    );

    dispatch(
      updateDeploymentPositionRequest(
        projectId,
        draggedDeploymentId,
        draggedDeployment.position,
        hoveredDeployment.position
      )
    );
  };

  const handleRename = (deploymentIdToRename, newName) => {
    dispatch(
      renameDeploymentRequest(
        deployments,
        projectId,
        deploymentIdToRename,
        newName
      )
    );
  };

  const handleChangeTab = (targetDeploymentId) => {
    if (targetDeploymentId !== deploymentId) {
      const path = getCurrentRoutePath(projectId, targetDeploymentId);
      history.push(path);
    }
  };

  const handleShowModal = () => {
    dispatch(showNewDeploymentModal());
  };

  useEffect(() => {
    dispatch(fetchDeploymentsRequest(projectId, true));
  }, [dispatch, projectId]);

  // This useEffect selects the first deployment when the component renders
  useEffect(() => {
    if (!deploymentId && !!deployments && deployments.length) {
      const [firstDeployment] = deployments;
      const firstDeploymentId = firstDeployment.uuid;
      if (deploymentId === firstDeploymentId) return;

      const path = getCurrentRoutePath(projectId, firstDeploymentId);
      history.push(path);
    }
  }, [deploymentId, deployments, history, projectId]);

  return (
    <>
      <TabsBar
        activeTab={deploymentId}
        deleteTitle='Excluir Este Fluxo?'
        loading={isLoading}
        onClick={handleShowModal}
        onDelete={handleDelete}
        onMoveTab={handleMoveTab}
        onDuplicate={handleDuplicate}
        onRename={handleRename}
        onChange={handleChangeTab}
        tabs={deployments}
      />

      <NewDeploymentModalContainer />
    </>
  );
};

export default DeploymentsTabsContainer;
